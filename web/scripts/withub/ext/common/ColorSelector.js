Ext.define('withub.ext.common.ColorSelector', {
    extend: 'Ext.Component',
    editable: false,
    readOnly: true,
    alias: 'widget.colorSelector',

    getValue: function () {
        return this.value;
    },

    setValue: function (hex) {
        this.value = hex;
        $('#colorpickerField').val(hex);
        $('#colorpickerField').css('backgroundColor', '#' + hex);
    },


    initComponent: function () {

        this.html = '<input type="text" maxlength="6" size="6" id="colorpickerField" value="' + this.value + '"  style="background-color: #' + this.value + '" />';

        this.callParent(arguments);

        this.on('afterrender', function () {
            this.initColorPicker();
        }, this);

    },

    initColorPicker: function () {
        var me = this;
        $('#colorpickerField').ColorPicker({
            color: me.value,
            onShow: function (colpkr) {
                $(colpkr).css({'z-index': 99999});
                $(colpkr).fadeIn(500);
                return false;
            },
            onHide: function (colpkr) {
                $(colpkr).fadeOut(500);
                return false;
            },
            onChange: function (hsb, hex, rgb) {
                me.setValue(hex);
            }
        });
    }
});



