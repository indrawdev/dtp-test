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
      { name: 'start', type: 'int' },
      { name: 'end', type: 'int' },
    ]
  });

  Ext.define('DataExperience', {
    extend: 'Ext.data.Model',
    fields: [
      { name: 'company', type: 'string' },
      { name: 'major', type: 'string' },
      { name: 'year', type: 'int' },
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
      url: 'employee/grid'
    },
    listeners: {
      beforeload: function (store) {
        Ext.apply(store.getProxy().extraParams, {
          // 'search': Ext.getCmp('txtSearchEmployee').getValue()
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
      url: 'employee/education'
    },
    listeners: {
      beforeload: function (store) {
        Ext.apply(store.getProxy().extraParams, {
          // 'employee_id': Ext.getCmp('txtId').getValue(),
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
      url: 'employee/experience'
    },
    listeners: {
      beforeload: function (store) {
        Ext.apply(store.getProxy().extraParams, {
          // 'employee_id': Ext.getCmp('txtId').getValue(),
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
    fieldLabel: 'Name',
    id: 'txtName',
    name: 'txtName',
    xtype: 'textfield',
  };

  var txtAddress = {
    afterLabelTextTpl: required,
    allowBlank: false,
    anchor: '98%',
    fieldLabel: 'Address',
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
      text: "Name",
      dataIndex: 'employee_name',
      menuDisabled: true,
      locked: true,
      width: 150
    }, {
      align: 'center',
      width: 35,
      xtype: 'actioncolumn',
      locked: true,
      items: [{

      }]
    }]
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
    ]
  });


  // FUNCTIONS
  function fnReset() {

  }

  function fnCheckSave() {
    if (this.up('form').getForm().isValid()) {
      Ext.Ajax.on('beforerequest', fnMaskShow);
      Ext.Ajax.on('requestcomplete', fnMaskHide);
      Ext.Ajax.on('requestexception', fnMaskHide);
    }
  }

  function fnSave() {
    Ext.Ajax.on('beforerequest', fnMaskShow);
    Ext.Ajax.on('requestcomplete', fnMaskHide);
    Ext.Ajax.on('requestexception', fnMaskHide);
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