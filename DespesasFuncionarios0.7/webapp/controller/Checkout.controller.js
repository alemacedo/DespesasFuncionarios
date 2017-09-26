sap.ui.define([
	"sap/ui/core/mvc/Controller",
	'sap/ui/model/json/JSONModel',
	'sap/m/MessageToast',
	'sap/m/MessageBox'
], function(Controller, JSONModel, MessageToast, MessageBox) {
	"use strict";

	return Controller.extend("DespesasFuncionarios.controller.Checkout", {
		
		onInit: function() {
			sap.ui.getCore().setModel(this.getView(), "controller3");
		},
		
		OnNavBack: function() {
			var oRouter = sap.ui.core.UIComponent.getRouterFor(this);
			var Controle3 = sap.ui.getCore().getModel("controller3").getController();
			if (!Controle3.confirmEscapePreventDialog) {
				Controle3.confirmEscapePreventDialog = new sap.m.Dialog({
					icon: sap.ui.core.IconPool.getIconURI("message-information"),

					content: [
						new sap.m.Text({
							text: "Suas informações serão perdidas."
						})
					],
					type: sap.m.DialogType.Message,
					buttons: [
						new sap.m.Button({
							text: "Sim",
							press: function() {
								Controle3.confirmEscapePreventDialog.close();
								oRouter.navTo("DespesasDiarias");

							}
						}),
						new sap.m.Button({
							text: "Não",
							press: function() {
								Controle3.confirmEscapePreventDialog.close();
							}
						})
					]
				});
			}
			Controle3.confirmEscapePreventDialog.open();
		}
	});
});