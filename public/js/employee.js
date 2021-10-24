Ext.Loader.setConfig({
  enabled: true
});

Ext.Loader.setPath('Ext.ux', gBaseUX);

Ext.require([
  'Ext.ux.form.NumericField',
  'Ext.ux.ProgressBarPager',
  'Ext.ProgressBar',
  'Ext.view.View',
]);

Ext.onReady(function () {
  Ext.QuickTips.init();
  Ext.util.Format.thousandSeparator = ',';
  Ext.util.Format.decimalSeparator = '.';

  var required = '<span style="color:red;font-weight:bold" data-qtip="Required">*</span>';
  var xtitle = 'DTP';

  // MODELS
  Ext.define('DataEmployee', {
    extend: 'Ext.data.Model',
    fields: [
      { name: 'id', type: 'int' },
      { name: 'name', type: 'string' },
      { name: 'address', type: 'string' },
      { name: 'identity', type: 'string' },
    ]
  });

  Ext.define('DataEducation', {
    extend: 'Ext.data.Model',
    fields: [
      { name: 'school', type: 'string' },
      { name: 'major', type: 'string' },
      { name: 'start', type: 'string' },
      { name: 'end', type: 'string' },
    ]
  });

  Ext.define('DataExperience', {
    extend: 'Ext.data.Model',
    fields: [
      { name: 'company', type: 'string' },
      { name: 'position', type: 'string' },
      { name: 'year', type: 'string' },
    ]
  });

  // STORES
  var groupEmployee = Ext.create('Ext.data.Store', {
    autoLoad: true,
    model: 'DataEmployee',
    pageSize: 25,
    proxy: {
      actionMethods: {
        read: 'POST'
      },
      reader: {
        rootProperty: 'result',
        totalProperty: 'total',
        type: 'json'
      },
      type: 'ajax',
      url: '/employees/main',
      headers: {
        'X-CSRF-TOKEN': csrf_token
      }
    },
    listeners: {
      beforeload: function (store) {
        Ext.apply(store.getProxy().extraParams, {
          'search': Ext.getCmp('txtSearchEmployee').getValue()
        });
      }
    }
  });

  var groupEducation = Ext.create('Ext.data.Store', {
    autoLoad: false,
    model: 'DataEducation',
    pageSize: 25,
    proxy: {
      actionMethods: {
        read: 'POST'
      },
      reader: {
        rootProperty: 'result',
        totalProperty: 'total',
        type: 'json'
      },
      type: 'ajax',
      url: 'employees/educations',
      headers: {
        'X-CSRF-TOKEN': csrf_token
      }
    },
    listeners: {
      beforeload: function (store) {
        Ext.apply(store.getProxy().extraParams, {
          'employee_id': Ext.getCmp('txtEmployeeIdEducation').getValue(),
        });
      }
    }
  });

  var groupExperience = Ext.create('Ext.data.Store', {
    autoLoad: false,
    model: 'DataExperience',
    pageSize: 25,
    proxy: {
      actionMethods: {
        read: 'POST'
      },
      reader: {
        rootProperty: 'result',
        totalProperty: 'total',
        type: 'json'
      },
      type: 'ajax',
      url: 'employees/experiences',
      headers: {
        'X-CSRF-TOKEN': csrf_token
      }
    },
    listeners: {
      beforeload: function (store) {
        Ext.apply(store.getProxy().extraParams, {
          'employee_id': Ext.getCmp('txtEmployeeIdExperience').getValue(),
        });
      }
    }
  });

  // COMPONENTS
  var txtId = {
    id: 'txtId',
    name: 'txtId',
    xtype: 'textfield',
    hidden: true
  };

  var txtName = {
    afterLabelTextTpl: required,
    allowBlank: false,
    anchor: '98%',
    fieldLabel: 'Nama',
    id: 'txtName',
    name: 'txtName',
    xtype: 'textfield',
  };

  var txtAddress = {
    afterLabelTextTpl: required,
    allowBlank: false,
    anchor: '98%',
    fieldLabel: 'Alamat',
    id: 'txtAddress',
    name: 'txtAddress',
    xtype: 'textarea',
  };

  var txtIdentity = {
    afterLabelTextTpl: required,
    allowBlank: false,
    anchor: '98%',
    fieldLabel: 'KTP',
    id: 'txtIdentity',
    name: 'txtIdentity',
    xtype: 'textfield',
  };

  var btnSave = {
    anchor: '90%',
    scale: 'small',
    xtype: 'button',
    id: 'btnSave',
    name: 'btnSave',
    text: 'Save',
    handler: fnCheckSave
  };

  var btnReset = {
    anchor: '90%',
    scale: 'small',
    xtype: 'button',
    id: 'btnReset',
    name: 'btnReset',
    text: 'Reset',
    handler: fnReset
  };

  var txtEmployeeIdExperience = {
    id: 'txtEmployeeIdExperience',
    name: 'txtEmployeeIdExperience',
    xtype: 'textfield',
    hidden: true
  };

  var cellEdit = Ext.create('Ext.grid.plugin.CellEditing', {
    clicksToEdit: 2,
    listeners: {
      edit: function (editor, e) {

      }
    }
  });

  // WINFORM
  var winGridEducation = Ext.create('Ext.grid.Panel', {
    anchor: '100%',
    autoDestroy: true,
    height: 400,
    width: 820,
    sortableColumns: false,
    store: groupEducation,
    columns: [
      { xtype: 'rownumberer', width: 20 },
      { text: "Employee", dataIndex: 'employee_id', menuDisabled: true, hidden: true },
      { text: "School", dataIndex: 'school', menuDisabled: true, flex: 3 },
      { text: "Major", dataIndex: 'major', menuDisabled: true, flex: 1 },
      { text: "Start", dataIndex: 'start', menuDisabled: true, flex: 0.5 },
      { text: "End", dataIndex: 'end', menuDisabled: true, flex: 0.5 },
    ],
    tbar: [{
      flex: 3,
      layout: 'anchor',
      xtype: 'container',
      items: [{
        id: 'txtEmployeeIdEducation',
        name: 'txtEmployeeIdEducation',
        xtype: 'textfield',
        hidden: true
      }, {
        anchor: '98%',
        emptyText: '',
        fieldLabel: 'School',
        fieldStyle: 'text-align: left;',
        id: 'txtSchool',
        name: 'txtSchool',
        labelAlign: 'top',
        xtype: 'textfield'
      }]
    }, {
      flex: 1,
      layout: 'anchor',
      xtype: 'container',
      items: [{
        anchor: '98%',
        emptyText: '',
        fieldLabel: 'Major',
        fieldStyle: 'text-align: left;',
        id: 'txtMajor',
        name: 'txtMajor',
        labelAlign: 'top',
        xtype: 'textfield'
      }]
    }, {
      flex: 0.5,
      layout: 'anchor',
      xtype: 'container',
      items: [{
        anchor: '98%',
        emptyText: '',
        fieldLabel: 'Start',
        fieldStyle: 'text-align: right;',
        id: 'txtStart',
        name: 'txtStart',
        labelAlign: 'top',
        xtype: 'numericfield'
      }]
    }, {
      flex: 0.5,
      layout: 'anchor',
      xtype: 'container',
      items: [{
        anchor: '98%',
        emptyText: '',
        fieldLabel: 'End',
        fieldStyle: 'text-align: right;',
        id: 'txtEnd',
        name: 'txtEnd',
        labelAlign: 'top',
        xtype: 'numericfield'
      }]
    }, {
      xtype: 'buttongroup',
      columns: 1,
      defaults: {
        scale: 'small'
      },
      items: [{
        iconCls: 'icon-add',
        text: 'Add',
        handler: function () {
          var total = groupEducation.getCount();
          var xschool = Ext.getCmp('txtSchool').getValue();

          var data = Ext.create('DataEducation', {
            school: Ext.getCmp('txtSchool').getValue(),
            major: Ext.getCmp('txtMajor').getValue(),
            start: Ext.getCmp('txtStart').getValue(),
            end: Ext.getCmp('txtEnd').getValue(),
          });

          var store = winGridEducation.getStore();
          var xcontinue = true;

          store.each(function (record, idx) {
            var xtext = record.get('school');
            if (xtext === xschool) {
              Ext.MessageBox.show({
                buttons: Ext.MessageBox.OK,
                closable: false,
                icon: Ext.Msg.WARNING,
                msg: xschool + ' Already on the list',
                title: xtitle
              });
              xcontinue = false;
            }
          });

          if (xcontinue === false) {
            return;
          }

          var school = Ext.getCmp('txtSchool').getValue();
          if (school === '') {
            Ext.MessageBox.show({
              buttons: Ext.MessageBox.OK,
              closable: false,
              icon: Ext.Msg.WARNING,
              msg: 'School, not filled',
              title: xtitle
            });
            return;
          }

          var major = Ext.getCmp('txtMajor').getValue();
          if (major === '') {
            Ext.MessageBox.show({
              buttons: Ext.MessageBox.OK,
              closable: false,
              icon: Ext.Msg.WARNING,
              msg: 'Major, not filled',
              title: xtitle
            });
            return;
          }

          var start = Ext.getCmp('txtStart').getValue();
          if (start === '') {
            Ext.MessageBox.show({
              buttons: Ext.MessageBox.OK,
              closable: false,
              icon: Ext.Msg.WARNING,
              msg: 'Year, not filled',
              title: xtitle
            });
            return;
          }

          var end = Ext.getCmp('txtEnd').getValue();
          if (end === '') {
            Ext.MessageBox.show({
              buttons: Ext.MessageBox.OK,
              closable: false,
              icon: Ext.Msg.WARNING,
              msg: 'Year, not filled',
              title: xtitle
            });
            return;
          }

          groupEducation.insert(total, data);

          Ext.getCmp('txtSchool').reset();
          Ext.getCmp('txtMajor').reset();
          Ext.getCmp('txtStart').reset();
          Ext.getCmp('txtEnd').reset();

          total = groupEducation.getCount() - 1;
          winGridEducation.getSelectionModel().select(total);
        }
      }, {
        iconCls: 'icon-delete',
        itemId: 'removeData',
        text: 'Delete',
        handler: function () {
          var sm = winGridEducation.getSelectionModel();
          groupEducation.remove(sm.getSelection());

          winGridEducation.getView().refresh();
          if (groupEducation.getCount() >= 0) {
            sm.select(0);
          }
        },
        disabled: true
      }]
    }],
    bbar: Ext.create('Ext.PagingToolbar', {
      displayInfo: false,
      pageSize: 25,
      plugins: Ext.create('Ext.ux.ProgressBarPager', {}),
      store: groupEducation,
      items: [{}]
    }),
    plugins: [
      cellEdit
    ],
    listeners: {
      selectionchange: function (view, records) {
        winGridEducation.down('#removeData').setDisabled(!records.length);
      }
    },
    viewConfig: {
      getRowClass: function () {
        return 'rowwrap';
      },
      markDirty: false
    }
  });

  var winPopupEducation = Ext.create('Ext.window.Window', {
    border: false,
    closable: false,
    draggable: true,
    frame: false,
    layout: 'fit',
    plain: true,
    resizable: false,
    title: 'Education',
    items: [
      winGridEducation
    ],
    listeners: {
      beforehide: function () {
        vMask.hide();
      },
      beforeshow: function () {
        groupEducation.load();
        vMask.show();
      }
    },
    buttons: [{
      text: 'Save',
      handler: function () {
        fnCheckSaveEducation();
      }
    }, {
      text: 'Close',
      handler: function () {
        winPopupEducation.hide();
      }
    }]
  });

  var winGridExperience = Ext.create('Ext.grid.Panel', {
    anchor: '100%',
    autoDestroy: true,
    height: 400,
    width: 820,
    sortableColumns: false,
    store: groupExperience,
    columns: [
      { xtype: 'rownumberer', width: 20 },
      { text: "Employee", dataIndex: 'employee_id', menuDisabled: true, hidden: true },
      { text: "Company", dataIndex: 'company', menuDisabled: true, flex: 3 },
      { text: "Position", dataIndex: 'position', menuDisabled: true, flex: 1 },
      { text: "Year", dataIndex: 'year', menuDisabled: true, flex: 0.5 },
    ],
    tbar: [{
      flex: 3,
      layout: 'anchor',
      xtype: 'container',
      items: [{
        id: 'txtEmployeeIdExperience',
        name: 'txtEmployeeIdExperience',
        xtype: 'textfield',
        hidden: true
      }, {
        anchor: '98%',
        emptyText: '',
        fieldLabel: 'Company',
        fieldStyle: 'text-align: left;',
        id: 'txtCompany',
        name: 'txtCompany',
        labelAlign: 'top',
        xtype: 'textfield'
      }]
    }, {
      flex: 1,
      layout: 'anchor',
      xtype: 'container',
      items: [{
        anchor: '98%',
        emptyText: '',
        fieldLabel: 'Position',
        fieldStyle: 'text-align: left;',
        id: 'txtPosition',
        name: 'txtPosition',
        labelAlign: 'top',
        xtype: 'textfield'
      }]
    }, {
      flex: 0.5,
      layout: 'anchor',
      xtype: 'container',
      items: [{
        anchor: '98%',
        emptyText: '',
        fieldLabel: 'Year',
        fieldStyle: 'text-align: right;',
        id: 'txtYear',
        name: 'txtYear',
        labelAlign: 'top',
        xtype: 'numericfield'
      }]
    }, {
      xtype: 'buttongroup',
      columns: 1,
      defaults: {
        scale: 'small'
      },
      items: [{
        iconCls: 'icon-add',
        text: 'Add',
        handler: function () {
          var total = groupExperience.getCount();
          var xcompany = Ext.getCmp('txtCompany').getValue();

          var data = Ext.create('DataExperience', {
            company: Ext.getCmp('txtCompany').getValue(),
            position: Ext.getCmp('txtPosition').getValue(),
            year: Ext.getCmp('txtYear').getValue(),
          });

          var store = winGridExperience.getStore();
          var xcontinue = true;

          store.each(function (record, idx) {
            var xtext = record.get('company');
            if (xtext === xcompany) {
              Ext.MessageBox.show({
                buttons: Ext.MessageBox.OK,
                closable: false,
                icon: Ext.Msg.WARNING,
                msg: xcompany + ' Already on the list',
                title: xtitle
              });
              xcontinue = false;
            }
          });

          if (xcontinue === false) {
            return;
          }

          var company = Ext.getCmp('txtCompany').getValue();
          if (company === '') {
            Ext.MessageBox.show({
              buttons: Ext.MessageBox.OK,
              closable: false,
              icon: Ext.Msg.WARNING,
              msg: 'Company, not filled',
              title: xtitle
            });
            return;
          }

          var position = Ext.getCmp('txtPosition').getValue();
          if (position === '') {
            Ext.MessageBox.show({
              buttons: Ext.MessageBox.OK,
              closable: false,
              icon: Ext.Msg.WARNING,
              msg: 'Position, not filled',
              title: xtitle
            });
            return;
          }

          var year = Ext.getCmp('txtYear').getValue();
          if (year === '') {
            Ext.MessageBox.show({
              buttons: Ext.MessageBox.OK,
              closable: false,
              icon: Ext.Msg.WARNING,
              msg: 'Year, not filled',
              title: xtitle
            });
            return;
          }

          groupExperience.insert(total, data);

          Ext.getCmp('txtCompany').reset();
          Ext.getCmp('txtPosition').reset();
          Ext.getCmp('txtYear').reset();

          total = groupExperience.getCount() - 1;
          winGridExperience.getSelectionModel().select(total);
        }
      }, {
        iconCls: 'icon-delete',
        itemId: 'removeData',
        text: 'Delete',
        handler: function () {
          var sm = winGridExperience.getSelectionModel();
          groupExperience.remove(sm.getSelection());

          winGridExperience.getView().refresh();
          if (groupExperience.getCount() >= 0) {
            sm.select(0);
          }
        },
        disabled: true
      }]
    }],
    bbar: Ext.create('Ext.PagingToolbar', {
      displayInfo: false,
      pageSize: 25,
      plugins: Ext.create('Ext.ux.ProgressBarPager', {}),
      store: groupExperience,
      items: []
    }),
    plugins: [
      cellEdit
    ],
    listeners: {
      selectionchange: function (view, records) {
        winGridExperience.down('#removeData').setDisabled(!records.length);
      }
    },
    viewConfig: {
      getRowClass: function () {
        return 'rowwrap';
      },
      markDirty: false
    }
  });

  var winPopupExperience = Ext.create('Ext.window.Window', {
    border: false,
    closable: false,
    draggable: true,
    frame: false,
    layout: 'fit',
    plain: true,
    resizable: false,
    title: 'Experience',
    items: [
      winGridExperience
    ],
    listeners: {
      beforehide: function () {
        vMask.hide();
      },
      beforeshow: function () {
        groupExperience.load();
        vMask.show();
      }
    },
    buttons: [{
      text: 'Save',
      handler: function () {
        fnCheckSaveExperience();
      }
    }, {
      text: 'Close',
      handler: function () {
        winPopupExperience.hide();
      }
    }]
  });

  // GRIDS
  var gridEmployee = Ext.create('Ext.grid.Panel', {
    defaultType: 'textfield',
    height: 440,
    sortableColumns: false,
    store: groupEmployee,
    columns: [{
      xtype: 'rownumberer',
      width: 35
    }, {
      text: "ID",
      dataIndex: 'employee_id',
      menuDisabled: true,
      hidden: true
    }, {
      text: "Nama",
      dataIndex: 'name',
      menuDisabled: true,
      locked: true,
      width: 150
    }, {
      align: 'center',
      width: 35,
      xtype: 'actioncolumn',
      locked: true,
      items: [{
        iconCls: 'icon-edit',
        tooltip: 'Edit',
        handler: function (grid, rowIndex, colIndex, e) {
          var xid = grid.getStore().getAt(rowIndex).get('id');
          var xname = grid.getStore().getAt(rowIndex).get('name');
          var xidentity = grid.getStore().getAt(rowIndex).get('identity');
          var xaddress = grid.getStore().getAt(rowIndex).get('address');

          Ext.getCmp('txtId').setValue(xid);
          Ext.getCmp('txtName').setValue(xname);
          Ext.getCmp('txtIdentity').setValue(xidentity);
          Ext.getCmp('txtAddress').setValue(xaddress);
        }
      }]
    }, {
      align: 'center',
      width: 35,
      xtype: 'actioncolumn',
      locked: true,
      items: [{
        iconCls: 'icon-complete',
        tooltip: 'Education',
        handler: function (grid, rowIndex, colIndex, e) {
          var xid = grid.getStore().getAt(rowIndex).get('id');
          var xname = grid.getStore().getAt(rowIndex).get('name');

          Ext.getCmp('txtEmployeeIdEducation').setValue(xid);
          fnShowEducation(xname);
        }
      }]
    }, {
      align: 'center',
      width: 35,
      xtype: 'actioncolumn',
      locked: true,
      items: [{
        iconCls: 'icon-complete',
        tooltip: 'Exprience',
        handler: function (grid, rowIndex, colIndex, e) {
          var xid = grid.getStore().getAt(rowIndex).get('id');
          var xname = grid.getStore().getAt(rowIndex).get('name');

          Ext.getCmp('txtEmployeeIdExperience').setValue(xid);
          fnShowExperience(xname);
        }
      }]
    }, {
      text: "KTP",
      dataIndex: 'identity',
      menuDisabled: true,
      flex: 0.5
    }, {
      text: "Alamat",
      dataIndex: 'address',
      menuDisabled: true,
      flex: 2
    }, {
      width: 20,
      xtype: 'actioncolumn',
      items: [{
        iconCls: 'icon-delete',
        tooltip: 'Delete',
        handler: function (grid, rowIndex, colIndex, e) {
          var xid = grid.getStore().getAt(rowIndex).get('id');
          if (xid) {
            Ext.MessageBox.show({
              title: 'Delete file',
              msg: 'Would you like to delete?',
              buttons: Ext.Msg.YESNO,
              icon: Ext.Msg.QUESTION,
              fn: function (btn) {
                if (btn == "yes") {
                  Ext.Ajax.request({
                    url: 'employees/delete',
                    headers: {
                      'X-CSRF-TOKEN': csrf_token
                    },
                    params: {
                      'id': xid
                    },
                    success: function (response) {
                      var xtext = Ext.decode(response.responseText);
                      Ext.MessageBox.show({
                        buttons: Ext.MessageBox.OK,
                        closable: false,
                        icon: Ext.MessageBox.INFO,
                        message: xtext.result,
                        title: xtitle
                      });

                      // load data
                      groupEmployee.load();
                    },
                    failure: function (response) {
                      var xtext = Ext.decode(response.responseText);
                      Ext.MessageBox.show({
                        buttons: Ext.MessageBox.OK,
                        closable: false,
                        icon: Ext.MessageBox.INFO,
                        message: xtext.result,
                        title: xtitle
                      });
                    }
                  });
                }
              }
            });
          }
        }
      }]
    }],
    tbar: [{
      flex: 0.7,
      layout: 'anchor',
      xtype: 'container',
      items: [{
        anchor: '98%',
        emptyText: 'Employee',
        id: 'txtSearchEmployee',
        name: 'txtSearchEmployee',
        xtype: 'textfield',
        listeners: {
          specialkey: function (field, e) {
            if (e.getKey() == e.ENTER) {
              groupEmployee.load();
            }
          }
        }
      }]
    }, {
      flex: 0.2,
      layout: 'anchor',
      xtype: 'container',
      items: [{
        anchor: '100%',
        text: 'Search',
        xtype: 'button',
        handler: function () {
          groupEmployee.load();
        }
      }]
    }, {
      flex: 0.01,
      layout: 'anchor',
      xtype: 'container',
      items: []
    }],
    bbar: Ext.create('Ext.PagingToolbar', {
      displayInfo: true,
      pageSize: 25,
      plugins: Ext.create('Ext.ux.ProgressBarPager', {}),
      store: groupEmployee
    }),
    viewConfig: {
      getRowClass: function (record) {
        return 'nowrap';
      },
      markDirty: true,
      stripeRows: false
    }
  });

  // FUNCTIONS
  function fnShowEducation(xname) {
    winPopupEducation.show();
    winPopupEducation.center();
    winPopupEducation.setTitle('Education ' + xname);
  }

  function fnShowExperience(xname) {
    winPopupExperience.show();
    winPopupExperience.center();
    winPopupExperience.setTitle('Experience ' + xname);
  }

  function fnReset() {
    Ext.getCmp('txtId').reset();
    Ext.getCmp('txtName').reset();
    Ext.getCmp('txtIdentity').reset();
    Ext.getCmp('txtAddress').reset();
  }

  function fnCheckSave() {
    if (this.up('form').getForm().isValid()) {
      Ext.Ajax.on('beforerequest', fnMaskShow);
      Ext.Ajax.on('requestcomplete', fnMaskHide);
      Ext.Ajax.on('requestexception', fnMaskHide);


      Ext.MessageBox.show({
        title: 'Save data',
        msg: 'Would you like to save?',
        buttons: Ext.Msg.YESNO,
        icon: Ext.Msg.QUESTION,
        fn: function (btn) {
          if (btn == "yes") {
            fnSave();
          }
        }
      });
    }
  }

  function fnSave() {
    Ext.Ajax.on('beforerequest', fnMaskShow);
    Ext.Ajax.on('requestcomplete', fnMaskHide);
    Ext.Ajax.on('requestexception', fnMaskHide);

    Ext.Ajax.request({
      method: 'POST',
      url: 'employees/store',
      headers: {
        'X-CSRF-TOKEN': csrf_token
      },
      params: {
        'id': Ext.getCmp('txtId').getValue(),
        'name': Ext.getCmp('txtName').getValue(),
        'identity': Ext.getCmp('txtIdentity').getValue(),
        'address': Ext.getCmp('txtAddress').getValue(),
      },
      success: function (response) {
        var xtext = Ext.decode(response.responseText);
        Ext.MessageBox.show({
          buttons: Ext.MessageBox.OK,
          closable: false,
          icon: Ext.MessageBox.INFO,
          msg: xtext.result,
          title: xtitle
        });
        groupEmployee.load();

        fnReset();
      },
      failure: function (response) {
        var xtext = Ext.decode(response.responseText);
        Ext.MessageBox.show({
          buttons: Ext.MessageBox.OK,
          closable: false,
          icon: Ext.MessageBox.INFO,
          msg: 'Saving Failed, Connection Failed!!',
          title: xtitle
        });
        fnMaskHide();
      }
    });
  }

  function fnCheckSaveEducation() {
    var store = winGridEducation.getStore();

    var xschool = '';
    var xmajor = '';
    var xstart = '';
    var xend = '';

    store.each(function (record, idx) {
      xschool = xschool + '|' + record.get('school');
      xmajor = xmajor + '|' + record.get('major');
      xstart = xstart + '|' + record.get('start');
      xend = xend + '|' + record.get('end');
    });

    Ext.Ajax.on('beforerequest', fnMaskShow);
    Ext.Ajax.on('requestcomplete', fnMaskHide);
    Ext.Ajax.on('requestexception', fnMaskHide);

    Ext.Ajax.request({
      method: 'POST',
      url: 'employees/savedu',
      headers: {
        'X-CSRF-TOKEN': csrf_token
      },
      params: {
        'employee_id': Ext.getCmp('txtEmployeeIdEducation').getValue(),
        'school': xschool,
        'major': xmajor,
        'start': xstart,
        'end': xend
      },
      success: function (response) {
        var xtext = Ext.decode(response.responseText);
        Ext.MessageBox.show({
          buttons: Ext.MessageBox.OK,
          closable: false,
          icon: Ext.MessageBox.INFO,
          msg: xtext.result,
          title: xtitle
        });

        // LOAD DATA
        groupEducation.load();
        groupEmployee.load();
      },
      failure: function (response) {
        var xtext = Ext.decode(response.responseText);
        Ext.MessageBox.show({
          buttons: Ext.MessageBox.OK,
          closable: false,
          icon: Ext.MessageBox.INFO,
          msg: 'Saving Failed, Connection Failed!!',
          title: xtitle
        });
        fnMaskHide();
      }
    });
  }

  function fnCheckSaveExperience() {
    var store = winGridExperience.getStore();

    var xcompany = '';
    var xposition = '';
    var xyear = '';

    store.each(function (record, idx) {
      xcompany = xcompany + '|' + record.get('company');
      xposition = xposition + '|' + record.get('position');
      xyear = xyear + '|' + record.get('year');
    });

    Ext.Ajax.on('beforerequest', fnMaskShow);
    Ext.Ajax.on('requestcomplete', fnMaskHide);
    Ext.Ajax.on('requestexception', fnMaskHide);

    Ext.Ajax.request({
      method: 'POST',
      url: 'employees/savexp',
      headers: {
        'X-CSRF-TOKEN': csrf_token
      },
      params: {
        'employee_id': Ext.getCmp('txtEmployeeIdExperience').getValue(),
        'company': xcompany,
        'position': xposition,
        'year': xyear
      },
      success: function (response) {
        var xtext = Ext.decode(response.responseText);
        Ext.MessageBox.show({
          buttons: Ext.MessageBox.OK,
          closable: false,
          icon: Ext.MessageBox.INFO,
          msg: xtext.result,
          title: xtitle
        });

        // LOAD DATA
        groupExperience.load();
        groupEmployee.load();
      },
      failure: function (response) {
        var xtext = Ext.decode(response.responseText);
        Ext.MessageBox.show({
          buttons: Ext.MessageBox.OK,
          closable: false,
          icon: Ext.MessageBox.INFO,
          msg: 'Saving Failed, Connection Failed!!',
          title: xtitle
        });
        fnMaskHide();
      }
    });
  }

  var frmEmployee = Ext.create('Ext.form.Panel', {
    border: false,
    frame: true,
    region: 'center',
    title: 'Master Employee',
    width: '100%',
    height: 600,
    items: [{
      bodyStyle: 'background-color: '.concat(gBasePanel),
      border: false,
      frame: false,
      xtype: 'form',
      items: [{
        fieldDefaults: {
          labelAlign: 'right',
          labelSeparator: '',
          labelWidth: 120,
          msgTarget: 'side'
        },
        xtype: 'fieldset',
        border: false,
        items: [{
          anchor: '100%',
          style: 'padding: 5px;',
          layout: 'hbox',
          xtype: 'container',
          items: [{
            flex: 1,
            layout: 'anchor',
            xtype: 'container',
            items: [{
              anchor: '98%',
              style: 'padding: 5px;',
              title: 'Form',
              xtype: 'fieldset',
              items: [
                txtId,
                txtName,
                txtAddress,
                txtIdentity
              ]
            }, {
              anchor: '100%',
              layout: 'hbox',
              xtype: 'container',
              items: [{
                flex: 1.2,
                layout: 'anchor',
                xtype: 'container',
                items: [

                ]
              }, {
                flex: 1,
                layout: 'anchor',
                xtype: 'container',
                items: [
                  btnSave
                ]
              }, {
                flex: 1,
                layout: 'anchor',
                xtype: 'container',
                items: [
                  btnReset
                ]
              }]
            }]
          }, {
            flex: 1.7,
            layout: 'anchor',
            xtype: 'container',
            items: [{
              anchor: '98%',
              style: 'padding: 5px;',
              title: 'Data',
              xtype: 'fieldset',
              items: [
                gridEmployee
              ]
            }]
          }]
        }]
      }]
    }]
  });

  var vMask = new Ext.LoadMask({
    msg: 'Please wait...',
    target: frmEmployee
  });

  function fnMaskShow() {
    frmEmployee.mask('Please wait...');
  }

  function fnMaskHide() {
    frmEmployee.unmask();
  }

  frmEmployee.render(Ext.getBody());
  Ext.get('loading').destroy();
});