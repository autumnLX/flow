<!DOCTYPE html>
<html>
  <head>
    <meta charset="utf-8">
    <title>咔咪英语听说自适应学习平台</title>
    <link rel="shortcut icon" href="/web/static/favicon.ico" type="image/x-icon">
    <link rel="stylesheet" href="/web/static/animate.css">
    <link rel="stylesheet" href="/web/static/normalize.css">
    <link rel="stylesheet" href="/web/css/common.css">
    <?php $include = preg_replace('/[\/]+/', '/', $_SERVER['DOCUMENT_ROOT']."/web/scaffold/config.php");include_once ("$include"); ?>
    <script src=/web/lib/jquery-1.11.1.min.js></script>
    <script type="text/javascript" src="https://sdk.cloud.chivox.com/chivoxsdk-js/v4.0/load_core.js"></script>
    <script src=/web/js/Config.js></script>
    <script src=/web/js/ConfigNew.js></script>
    <script src="/web/static/SDK.js"></script>
    <script src=/web/js/ReportMapping.js></script>
    <script src="/web/js/Util.js"></script>
    <script src="/web/lib/jquery.cookie.js"></script>
  </head>
  <body>
    <div id="app"></div>
    <!-- built files will be auto injected -->
  </body>
</html>
