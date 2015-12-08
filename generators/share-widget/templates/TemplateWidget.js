define(["dojo/_base/declare",
        "dijit/_WidgetBase",
        "alfresco/core/Core",
        "dijit/_TemplatedMixin",
        "dojo/text!./templates/<%= widgetName %>.html"
    ],
    function(declare, _Widget, Core, _Templated, template) {
        return declare([_Widget, Core, _Templated], {
            templateString: template,
            i18nRequirements: [ {i18nFile: "./i18n/<%= widgetName %>.properties"} ],
            cssRequirements: [{cssFile:"./css/<%= widgetName %>.css"}],

            buildRendering: function example_widgets_<%= widgetName %>__buildRendering() {
                this.greeting = this.message('hello-label');

                this.inherited(arguments);

            }
        });
});
