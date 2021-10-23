<!DOCTYPE html>
<html lang="{{ str_replace('_', '-', app()->getLocale()) }}">

<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">

    <title>DTP</title>
    <link rel="stylesheet" type="text/css" href="/assets/ext-5.1.0/build/packages/ext-theme-neptune/build/resources/ext-theme-neptune-all.css">
    <div class="center" id="loading">
        <img src="{{ asset('img/loading.gif') }}" alt="Loading" />
    </div>

    <script type="text/javascript" src="/assets/ext-5.1.0/build/ext-all.js"></script>
    <script type="text/javascript" src="/assets/ext-5.1.0/build/packages/ext-locale/build/ext-locale-en.js"></script>
    <script type="text/javascript">
        var gBaseUX = '/assets/ext-5.1.0/build/ux';
        var gBaseIMG = '/assets/css/img/';
        var gBasePanel = '#ffffff;';
    </script>
    <script type="text/javascript" src="{{ asset('js/employee.js') }}"></script>
</head>

<body>
</body>

</html>