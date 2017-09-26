sap.ui.define([
	"sap/ui/core/mvc/Controller",
	"sap/m/MessageToast",
	'sap/ui/model/json/JSONModel',
	'sap/m/Button',
	'sap/m/Dialog',
	'sap/m/MessageBox',
	'sap/ui/core/format/DateFormat'
], function(Controller, MessageToast, JSONModel, Button, Dialog, MessageBox, DateFormat) {
	"use strict";

	var newController = Controller.extend("DespesasFuncionarios.controller.NovaDespesa", {
/////////Não to conseguindo fazer a formatação da data funcionar!        
        oFormatDdmmyyyy: null,

		onInit: function() {
			sap.ui.getCore().setModel(this.getView(), "controller");
			var Controle = sap.ui.getCore().getModel("controller").getController();

/////////////////////Não to conseguindo fazer a formatação da data funcionar!
			Controle.oFormatDdmmyyyy = DateFormat.getInstance({
				style: "short"
			});
			
			
			sap.ui.getCore().setModel(this.getView(), "controller");

			var oModel = new JSONModel();
			oModel.setData({
				dateValue: new Date()
			});

			//carregando a lista do comboBox mês
			var ano = new Date().toLocaleDateString().substring(5, 11);
			var mesatual = new Date().toLocaleDateString().substring(3, 5);
			Controle.byId("atual").setText(mesatual + ano);
			if (mesatual < 10) {
				var mesanterior = mesatual - 1;
				Controle.byId("anterior").setText("0" + mesanterior + ano);
			} else if (mesatual > 9) {
				mesanterior = mesatual - 1;
				Controle.byId("anterior").setText(mesanterior + ano);
			}

			Controle.getView().setModel(oModel);
			Controle.carregaComboCliente();
			Controle.carregaNomeUsuario();
		},

		//Carregando o combo de Clientes, pegando os dados da base do ECC
		carregaComboCliente: function() {
			var Controle = sap.ui.getCore().getModel("controller").getController();
			var sUrl = "/sap/opu/odata/sap/ZCONTROLEDESPESAS_SRV";
			var oModel1 = new sap.ui.model.odata.ODataModel(sUrl, true);
			var JSONModel1 = new sap.ui.model.json.JSONModel();
			var paramCliente = "/ClientesSet";
			oModel1.read(paramCliente, {
				success: function(oData, oResponse) {
					//alert("success");
					JSONModel1.setData(oData.results);
					var listCliente = Controle.byId("comboCliente");
					listCliente.setModel(JSONModel1);
				},
				error: function(erro) {
					//alert("error");
				}
			});
		},
		//Pegando o nome de usuario da base de dados do ECC
		carregaNomeUsuario: function() {
			var Controle = sap.ui.getCore().getModel("controller").getController();
			var sUrl = "/sap/opu/odata/sap/ZCONTROLEDESPESAS_SRV";
			var oModel = new sap.ui.model.odata.ODataModel(sUrl, true);
			JSONModel = new sap.ui.model.json.JSONModel();
			var paramUsu = "/UserSet";
			oModel.read(paramUsu, {
				success: function(oData) {
					//alert("success");
					JSONModel.setData(oData.results[0]);
					var nomeUsuario = Controle.getView().byId("nomeUsu");
					nomeUsuario.setText(oData.results[0].Bname);
				},
				error: function(erro) {
					//alert("error");
				}
			});
		},

		//Carregando o combo de Projetos ao clicar em um cliente( buscando no ECC)
		pressChangeCliente: function(oEvent) {
			var x = oEvent.getSource().getSelectedKey();
			var Controle = sap.ui.getCore().getModel("controller").getController();
			var sUrl = "/sap/opu/odata/sap/ZCONTROLEDESPESAS_SRV";
			var oModel2 = new sap.ui.model.odata.ODataModel(sUrl, true);
			var JSONModel2 = new sap.ui.model.json.JSONModel();
			var paramProjeto = "/ProjetoSet?%24filter=Idcliente+eq+" + x;
			oModel2.read(paramProjeto, {
				success: function(oData, oResponse) {
					//alert("success");
					JSONModel2.setData(oData.results);
					var listProjeto = Controle.byId("comboProjeto");
					listProjeto.setModel(JSONModel2);
				},
				error: function(erro) {
					//alert("error");
				}
			});
		},

		//Fazendo validações e preenchendo a tabela interna com as informações dos campos da tela.
		onBtAvancarPress: function() {
			var Controle = sap.ui.getCore().getModel("controller").getController();
			if (Controle.byId("comboMes").getValue() === "") {
				var bCompact = !!Controle.getView().$().closest(".sapUiSizeCompact").length;
				MessageBox.alert(
					"Preencha todos os campos para avançar.", {
						styleClass: bCompact ? "sapUiSizeCompact" : ""
					}
				);
			} else if (Controle.byId("comboCliente").getValue() === "") {
				bCompact = !!Controle.getView().$().closest(".sapUiSizeCompact").length;
				MessageBox.alert(
					"Preencha todos os campos para avançar.", {
						styleClass: bCompact ? "sapUiSizeCompact" : ""
					}
				);
			} else if (Controle.byId("comboProjeto").getValue() === "") {
				bCompact = !!Controle.getView().$().closest(".sapUiSizeCompact").length;
				MessageBox.alert(
					"Preencha todos os campos para avançar.", {
						styleClass: bCompact ? "sapUiSizeCompact" : ""
					}
				);
			} else {
				Controle.preencheTabelaInterna();
			}
		},

		//Preenchendo a tabela interna com os dados da tela e chamando o calendario.
		preencheTabelaInterna: function() {
			var Controle = sap.ui.getCore().getModel("controller").getController();
			var t_interna = {
				//HEADER
				mesDespesa: Controle.byId("comboMes").getValue(),
				cliente: Controle.byId("comboCliente").getSelectedKey(),
				projeto: Controle.byId("comboProjeto").getSelectedKey(),
				reembolso: Controle.byId("checkReembolso").getSelected(),
				usuario: Controle.byId("nomeUsu").getText(),
				dias: []
			};
			sap.ui.getCore().setModel(t_interna, "t_interna");
			Controle.carregaPrimeiraData();
			// var oRouter = sap.ui.core.UIComponent.getRouterFor(Controle);
			// oRouter.navTo("DespesasDiarias");
		},

		//calendario que passara a data do primeiro dia a ser reembolsado para a próxima tela.
		carregaPrimeiraData: function() {
			var Controle = sap.ui.getCore().getModel("controller").getController();
			var selectedMonth = Controle.byId("comboMes").getValue().substring(1, 2) - 1;
			Controle.oDialog2 = new sap.m.Dialog("dialog2ID", {
				title: "Selecione a primeira data",
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

							new sap.ui.unified.Calendar("singleDayCalendar", {
								minDate: new Date(2017, selectedMonth, 1),
								maxDate: new Date(2017, selectedMonth, 31),
								start: new Date(),
								select: Controle.handleCalendarSelect,
								width: "100%",
								visible: true
							})
						]
					}),
					new sap.m.Text("diaSelecionado2", {
						text: "",
						textAlign: sap.ui.core.TextAlign.Center
					})
				]
			});
			Controle.oDialog2.addButton(
				new sap.m.Button({
					text: "Cancelar",
					press: function() {
						Controle.oDialog2.close();
						Controle.oDialog2.destroy();
					}
				}));
			Controle.oDialog2.addButton(
				new sap.m.Button({
					text: "OK",
					press: function(oEvent) {
						var dia1Click = Controle.oDialog2.getContent()[2].getText();
						sap.ui.getCore().setModel(dia1Click, "dia1Click");
						var oRouter = sap.ui.core.UIComponent.getRouterFor(Controle);
						Controle.oDialog2.close();
						Controle.oDialog2.destroy();
						oRouter.navTo("DespesasDiarias");
					}
				}));
			Controle.oDialog2.open();
		},

		handleCalendarSelect: function(oEvent) {
			var Controle = sap.ui.getCore().getModel("controller").getController();
			var oCalendar = oEvent.oSource;
			var oText = Controle.oDialog2.getContent()[2];
			var aSelectedDates = oCalendar.getSelectedDates();
			var oDate;
			if (aSelectedDates.length > 0) {
				oDate = aSelectedDates[0].getStartDate();
////////////////Este comando para a formatação não esta funcionando.... não consigo entender o pq..
			  //oText.setText(Controle.oFormatYyyymmdd.format(oDate));
				oText.setText(oDate);
			} else {
				oText.setValue("");
			}
		},

		OnNavBack: function() {
			var oRouter = sap.ui.core.UIComponent.getRouterFor(this);
			var Controle = sap.ui.getCore().getModel("controller").getController();
			if (!Controle.confirmEscapePreventDialog) {
				Controle.confirmEscapePreventDialog = new sap.m.Dialog({

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
								Controle.confirmEscapePreventDialog.close();
								oRouter.navTo("Tiles");
								Controle.ClearFields();
							}
						}),
						new sap.m.Button({
							text: "Não",
							press: function() {
								Controle.confirmEscapePreventDialog.close();
							}
						})
					]
				});
			}
			Controle.confirmEscapePreventDialog.open();
		},

		ClearFields: function() {
			var Controle = sap.ui.getCore().getModel("controller").getController();
			Controle.byId("comboMes").setValue("");
			Controle.byId("comboCliente").setValue("");
			Controle.byId("comboProjeto").setValue("");
			Controle.byId("checkReembolso").setSelected(false);
		}

	});
	return newController;
});