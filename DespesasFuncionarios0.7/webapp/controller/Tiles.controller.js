sap.ui.define([
	"sap/ui/core/mvc/Controller",
	"sap/m/MessageToast"
], function(Controller, MessageToast) {
	"use strict";

	return Controller.extend("DespesasFuncionarios.controller.Tiles", {

		onNovoRelatorioPress: function(evt) {
			// var clique = evt.getSource();
			// MessageToast.show(clique);
			var oRouter = sap.ui.core.UIComponent.getRouterFor(this);
			oRouter.navTo("NovaDespesa");
		},

		onListaRelatoriosPress: function(evt) {
			var clique = evt.getSource();
			MessageToast.show(clique);
		}

	});
});