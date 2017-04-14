/**
 * Created by CAOTE on 12/12/2016.
 */
(function(){
    var dependency =
        [   'ngRoute',
            'ui.select',
            'ui.grid',
            'ui.grid.cellNav',
            'ui.grid.resizeColumns',
            'ui.grid.selection',
            'ui.grid.autoResize',
            'ui.grid.pinning',
            'ui.grid.exporter',
            'ui.grid.pagination',
            'ui.bootstrap.datetimepicker',
            'ui.bootstrap',
            'ui.bootstrap.datetimepicker'
        ];

   angular.module('databot',dependency);
        console.log(123)
})();