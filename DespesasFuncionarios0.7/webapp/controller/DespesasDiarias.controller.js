sap.ui.define([
	"sap/ui/core/mvc/Controller",
	'sap/ui/model/json/JSONModel',
	'sap/m/MessageToast',
	'sap/m/MessageBox'
], function(Controller, JSONModel, MessageToast, MessageBox) {
	"use strict";

	return Controller.extend("DespesasFuncionarios.controller.DespesasDiarias", {
		oFormatYyyymmdd: null,

		onInit: function() {
			sap.ui.getCore().setModel(this.getView(), "controller2");
			var Controle2 = sap.ui.getCore().getModel("controller2").getController();

			Controle2.oFormatYyyymmdd = sap.ui.core.format.DateFormat.getInstance({
				style: "short"
			});

			//multiple dates
			Controle2.oModel = new JSONModel({
				selectedDates: []
			});
			var oRouter = sap.ui.core.UIComponent.getRouterFor(Controle2);
			oRouter.getRoute("DespesasDiarias").attachMatched(Controle2.carregaPrimeiraData, Controle2);
		},

		//Carregando a primeira data no text da tela
		carregaPrimeiraData: function() {
			var Controle2 = sap.ui.getCore().getModel("controller2").getController();
			var dia1Click = sap.ui.getCore().getModel("dia1Click");
			Controle2.byId("recebeNovaData").setText(dia1Click);
		},

		handleCalendarSelect: function(oEvent) {
			var Controle2 = sap.ui.getCore().getModel("controller2").getController();
			var oCalendar = oEvent.oSource;
			var oText = this.getParent().getParent().getContent()[2];
			var aSelectedDates = oCalendar.getSelectedDates();
			var oDate;
			if (aSelectedDates.length > 0) {
				oDate = aSelectedDates[0].getStartDate();
				oText.setText(Controle2.oFormatYyyymmdd.format(oDate));
			} else {
				oText.setValue("");
			}
		},

		handleMultipleCalendarSelect: function(oEvent) {
			var Controle2 = sap.ui.getCore().getModel("controller2").getController();
			var oCalendar = oEvent.oSource;
			var aSelectedDates = oCalendar.getSelectedDates();
			var oDate;
			var oData = {
				selectedDates: []
			};
			if (aSelectedDates.length > 0) {
				for (var i = 0; i < aSelectedDates.length; i++) {
					oDate = aSelectedDates[i].getStartDate();
					oData.selectedDates.push({
						Date: Controle2.oFormatYyyymmdd.format(oDate)
					});
				}
				Controle2.oModel.setData(oData);
			} else {
				Controle2._clearModel();
			}
		},
		handleRemoveSelection: function(oEvent) {
			var Controle2 = sap.ui.getCore().getModel("controller2").getController();
			if (Controle2.oDialog.getContent()[1].getItems()[2].getVisible() === true) {
				Controle2.oDialog.getContent()[1].getItems()[2].removeAllSelectedDates();
			}

		},

		_clearModel: function() {
			var Controle2 = sap.ui.getCore().getModel("controller2").getController();
			var oData = {
				selectedDates: []
			};
			Controle2.oModel.setData(oData);
		},

		limpacampos: function() {
			var Controle2 = sap.ui.getCore().getModel("controller2").getController();
			Controle2.byId("recebeNovaData").setText("");
			Controle2.byId("txt_kmDiario").setValue("");
			Controle2.byId("txt_pedagio").setValue("");
			Controle2.byId("txt_estacionamento").setValue("");
			Controle2.byId("txt_cafe").setValue("");
			Controle2.byId("txt_almoco").setValue("");
			Controle2.byId("txt_jantar").setValue("");
			Controle2.byId("txt_hosp").setValue("");
			Controle2.byId("txt_taxi").setValue("");
			Controle2.byId("txt_outros").setValue("");

		},

		selectSingleDay: function(oEvent) {
			var Controle2 = sap.ui.getCore().getModel("controller2").getController();
			Controle2.oDialog.getContent()[1].getItems()[1].setVisible(true);
			Controle2.oDialog.getContent()[1].getItems()[2].setVisible(false);
			Controle2.oDialog.getContent()[1].getItems()[3].setVisible(false);
		},

		selectMultipleDay: function(oEvent) {
			var Controle2 = sap.ui.getCore().getModel("controller2").getController();
			Controle2.oDialog.getContent()[1].getItems()[1].setVisible(false);
			Controle2.oDialog.getContent()[1].getItems()[2].setVisible(true);
			Controle2.oDialog.getContent()[1].getItems()[3].setVisible(true);
		},

		onPressProximo: function(oEvent) {
			var Controle2 = sap.ui.getCore().getModel("controller2").getController();

			Controle2.oDialog = new sap.m.Dialog("dialogID", {
				title: "Nova data",
				icon: "sap-icon://calendar",
				type: "Message",
				content: [
					new sap.m.Text({
						text: "",
						width: "20px",
						maxLines: 1,
						wrapping: false,
						textAlign: "Begin",
						textDirection: "Inherit"
					}),
					new sap.m.VBox({
						alignItems: "Stretch",
						fitContainer: false,
						width: "auto",
						height: "auto",
						justifyContent: "Center",
						renderType: "Div",
						visible: true,
						displayInline: false,
						items: [
							new sap.m.RadioButtonGroup({
								selectedIndex: -1,
								select: Controle2.handleRemoveSelection,
								buttons: [
									new sap.m.RadioButton({
										// groupName: "GroupA",
										text: "Inserir despesas de um novo dia",
										width: "100%",
										select: Controle2.selectSingleDay,
										selected: false,
										textAlign: sap.ui.core.TextAlign.Center
									}),
									new sap.m.RadioButton({
										// groupName: "GroupA",
										text: "Fazer isso para os próximos dias",
										width: "100%",
										select: Controle2.selectMultipleDay,
										selected: false,
										textAlign: sap.ui.core.TextAlign.Center
									})
								]
							}),

							new sap.ui.unified.Calendar("singleDay", {
								minDate: new Date(2017, 8, 1),
								maxDate: new Date(2017, 9, 31),
								start: new Date(),
								select: Controle2.handleCalendarSelect,
								width: "100%",
								visible: false
							}),
							new sap.ui.unified.Calendar("multipleDay", {
								minDate: new Date(2017, 8, 1),
								maxDate: new Date(2017, 9, 31),
								start: new Date(),
								singleSelection: false,
								intervalSelection: false,
								select: Controle2.handleMultipleCalendarSelect,
								width: "100%",
								visible: false
							}),
							new sap.m.Button({
								press: Controle2.handleRemoveSelection,
								text: "Desfazer seleção",
								visible: false
							})
						]
					}),
					new sap.m.Text("diaSelecionado", {
						text: "",
						textAlign: sap.ui.core.TextAlign.Center
					})
				]
			});
			Controle2.oDialog.addButton(
				new sap.m.Button({
					text: "Cancelar",
					press: function() {
						Controle2.oDialog.close();
						Controle2.oDialog.destroy();
					}
				}));
			Controle2.oDialog.addButton(
				new sap.m.Button({
					text: "OK",
					press: function() {
						var diaClick = Controle2.oDialog.getContent()[2].getText();
						sap.ui.getCore().setModel(diaClick, "diaClick");
						Controle2.carregaTabelaInterna();
						Controle2.verificaRadioButton();
						Controle2.oDialog.close();
						Controle2.oDialog.destroy();
					}
				}));
			Controle2.oDialog.open();
		},

		carregaTabelaInterna: function() {
			var Controle2 = sap.ui.getCore().getModel("controller2").getController();
			var t_interna = sap.ui.getCore().getModel("t_interna");

			//var list = Controle2.oDialog.getContent()[1].getItems()[1].getSelectedDates();

			t_interna.dias.push({
				recebeNovaData: Controle2.byId("recebeNovaData").getText(),
				txt_kmDiario: Controle2.byId("txt_kmDiario").getValue(),
				txt_pedagio: Controle2.byId("txt_pedagio").getValue(),
				txt_estacionamento: Controle2.byId("txt_estacionamento").getValue(),
				txt_cafe: Controle2.byId("txt_cafe").getValue(),
				txt_almoco: Controle2.byId("txt_almoco").getValue(),
				txt_jantar: Controle2.byId("txt_jantar").getValue(),
				txt_hosp: Controle2.byId("txt_hosp").getValue(),
				txt_taxi: Controle2.byId("txt_taxi").getValue(),
				txt_outros: Controle2.byId("txt_outros").getValue()
			});

			sap.ui.getCore().setModel(t_interna, "t_interna");
		},

		verificaRadioButton: function() {
			var Controle2 = sap.ui.getCore().getModel("controller2").getController();
			var diaClick = sap.ui.getCore().getModel("diaClick");
			if (Controle2.oDialog.getContent()[1].getItems()[0].getButtons()[0].getSelected() === true) {
				//alert("calendario1 selected");
				/////// INSERIR AQUI A AÇÃO PARA QUANDO O CALENDARIO DE SELECAO UNICA FOR ESCOLHIDO PELO USUARIO
				if (!diaClick) {
					var Compact = !!Controle2.getView().$().closest(".sapUiSizeCompact").length;
					MessageBox.alert(
						"Selecionar a nova data data", {
							styleClass: Compact ? "sapUiSizeCompact" : ""
						}
					);
				} else {
					Controle2.byId("recebeNovaData").setVisible(true);
					Controle2.byId("recebeNovaData").setText(diaClick);
					Controle2.ClearFields();

				}

			} else if (Controle2.oDialog.getContent()[1].getItems()[0].getButtons()[1].getSelected() === true) {
				alert("calendario2 selected");
				/////// INSERIR AQUI A AÇÃO PARA QUANDO O CALENDARIO DE SELECAO MULTIPLA FOR ESCOLHIDO PELO USUARIO
			}
		},

		OnNavBack: function() {
			var oRouter = sap.ui.core.UIComponent.getRouterFor(this);
			var Controle2 = sap.ui.getCore().getModel("controller2").getController();
			if (!Controle2.confirmEscapePreventDialog) {
				Controle2.confirmEscapePreventDialog = new sap.m.Dialog({

					icon: sap.ui.core.IconPool.getIconURI("message-information"),
					title: "Tem certeza que deseja sair?",

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
								Controle2.ClearFields();
								Controle2.byId("recebeNovaData").setVisible(false);
								Controle2.confirmEscapePreventDialog.close();
								oRouter.navTo("NovaDespesa");

							}
						}),
						new sap.m.Button({
							text: "Não",
							press: function() {
								Controle2.confirmEscapePreventDialog.close();
							}
						})
					]
				});
			}
			Controle2.confirmEscapePreventDialog.open();
		},

		ClearFields: function() {
			var Controle2 = sap.ui.getCore().getModel("controller2").getController();
			// var t_interna = sap.ui.getCore().getModel("t_interna");
			// var key;
			// for (key in t_interna) {
			// 	t_interna[key] = "";
			// }

			Controle2.byId("txt_kmDiario").setValue("");
			Controle2.byId("txt_pedagio").setValue("");
			Controle2.byId("txt_estacionamento").setValue("");

			Controle2.byId("txt_cafe").setValue("");
			Controle2.byId("txt_almoco").setValue("");
			Controle2.byId("txt_jantar").setValue("");

			Controle2.byId("txt_hosp").setValue("");
			Controle2.byId("txt_taxi").setValue("");
			Controle2.byId("txt_outros").setValue("");
		}
	});
});