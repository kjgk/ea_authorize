Ext.define('withub.ext.common.YearRange', {
    extend:'Ext.form.FieldContainer',
    alias:'widget.yearrange',
    width:200,
    height:24,
    style:'padding-top: 1px;',
    layout:{
        type:'hbox',
        align:'stretch'
    },
    beginYearName:'beginYear',
    endYearName:'endYear',
    yearRange:[0, 0],
    range:-2,

    initComponent:function () {

        this.beginYearField = Ext.create('withub.ext.common.YearCombo', {
            name: this.beginDateName,
            flex: 1,
            range:this.yearRange,
            value:new Date().getFullYear() + this.range
        });

        this.endYearField = Ext.create('withub.ext.common.YearCombo', {
            name: this.beginDateName,
            flex: 1,
            range:[0,3],
            value:new Date().getFullYear()
        });

        this.items = [this.beginYearField, {xtype:'label', text:'至', style:'padding: 2px;'} , this.endYearField];

        this.callParent();
    },

    getBeginYear:function () {

        return this.beginYearField.value;
    },

    getEndYear:function () {

        return this.endYearField.value;
    }
});