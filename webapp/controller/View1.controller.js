sap.ui.define([
			"sap/ui/core/mvc/Controller",
			"com/testTest/js/jszip",
			"com/testTest/js/xlsx",
			'sap/ui/export/library',
			'sap/ui/export/Spreadsheet',
			"sap/m/MessageBox",
			"sap/m/MessageToast"
		], function(Controller, jszip, xlsx, exportLibrary, Spreadsheet, MessageBox, MessageToast) {
			"use strict";

			var EdmType = exportLibrary.EdmType;
			return Controller.extend("com.testTest.controller.View1", {
					onInit: function() {
						this.sServiceURL = "";
						this.blankModel = new sap.ui.model.json.JSONModel();
					},

					onAddL: function(oEvent) {
						var pos = 0;
						var oTable = this.getView().byId("t1");
						var oSelectedItem = oTable.getSelectedItem();
						if (oSelectedItem) {
							// Edit mode: Populate form with selected data
							var oSelectedData = oSelectedItem.getBindingContext().getObject();
							this.populateFormWithData(oSelectedData);
						} else {
							// Add mode: Clear the form or set default values
							this.onClearInputSelect(["i1", "i2", "i3", "i4", "i5", "i6", "i7", "i8", "i9", "i10"]);
						}
					},

					onRowSelect: function(oEvent) {
						var oTable = oEvent.getSource();
						var oSelectedItem = oTable.getSelectedItem();

						if (oSelectedItem) {
							var oSelectedData = oSelectedItem.getBindingContext().getObject();
							this.formData(oSelectedData);
						}
					},
					formData: function(oData) {
						// Set data to form fields
						this.getView().byId("i1").setValue(oData.Side);
						this.getView().byId("i2").setValue(oData.PlanDate);
						this.getView().byId("i3").setValue(oData.PlanTime);
						this.getView().byId("i4").setValue(oData.ActualDate);
						this.getView().byId("i5").setValue(oData.ActualTime);
						this.getView().byId("i6").setValue(oData.OnOffBloctTime);
						this.getView().byId("i7").setValue(oData.OnOffBloctTime(UTC));
						this.getView().byId("i8").setValue(oData.Airline);
						this.getView().byId("i9").setValue(oData.FlightNo);
						this.getView().byId("i10").setValue(oData.Routing);
					},

					onValidateLength: function(id, length, txt, mandatory) {
						var val = id.getValue();
						var len = val.length;
						if (len === 0 && mandatory === 1) {
							id.setValueStateText(txt + " must not be empty.");
							id.setValueState("Error");
							id.focus();
							return (0);
						} else if (len > length) {
							id.setValueStateText("Maximum " + length + " characters.");
							id.setValueState("Error");
							id.focus();
							return (0);
						} else {
							id.setValueState("None");
							return (1);
						}
					},

					onValidateSelect: function(id, txt) {
						var val = id.getSelectedKey();
						if (val === "") {
							id.setValueStateText("Please select " + txt + ".");
							id.setValueState("Error");
							id.focus();
							return (0);
						} else {
							id.setValueState("None");
							return (1);
						}
					},

					onOdataErrorMsg: function(err, type) {
						switch (type) {
							case 1:
								sap.m.MessageBox.show(err, sap.m.MessageBox.Icon.ERROR, "Error", [sap.m.MessageBox.Action.CLOSE]);
								break;
							case 2:
								sap.m.MessageBox.show(err, sap.m.MessageBox.Icon.INFORMATION, "Information", [sap.m.MessageBox.Action.CLOSE]);
								break;
							case 3:
								sap.m.MessageBox.show(err, sap.m.MessageBox.Icon.SUCCESS, "Success", [sap.m.MessageBox.Action.CLOSE]);
								break;
							case 4:
								sap.m.MessageBox.show(err, sap.m.MessageBox.Icon.WARNING, "Warning", [sap.m.MessageBox.Action.CLOSE]);
								break;
						}
					},

					onValidate: function(foc, arr) {
						var flag = 0;
						for (var i = 0; i < foc.length; i++) {
							if (arr[i] === 0) {
								this.getView().byId(foc[i]).focus();
								this.getView().byId(foc[i]).setValueState("Error");
								flag = 1;
								break;
							}
						}
						if (flag === 0) {
							return (1);
						} else {
							return (0);
						}
					},

					onClear: function() {
						//this.onDisplay(3,false);
						this.onDisplay(99, false);
					},

					onClearInputSelect: function(input, select, cb) {
						var i = 0;
						for (i = 0; i < input.length; i++) {
							this.getView().byId(input[i]).setValue("");
							this.getView().byId(input[i]).setValueState("None");
						}
						for (i = 0; i < select.length; i++) {
							this.getView().byId(select[i]).setSelectedKey("");
							this.getView().byId(select[i]).setValueState("None");
						}
						for (i = 0; i < cb.length; i++) {
							this.getView().byId(cb[i]).setSelectedIndex(0);
						}
					},

					onEnabledDisabled: function(enabled, boolean) {
						for (var i = 0; i < enabled.length; i++) {
							this.getView().byId(enabled[i]).setEnabled(boolean);
						}
					},

					onVisibleInvisble: function(visible, boolean) {
						//var i = 0;
						for (var i = 0; i < visible.length; i++) {
							this.getView().byId(visible[i]).setVisible(boolean);
						}
					},

					onblankModel: function(sm) {
						for (var i = 0; i < sm.length; i++) {
							this.getView().byId(sm[i]).setModel(this.blankModel);
						}
					},

					onDateFormate: function(fdate) {
						//var f = fdate.slice(6,10) + "-" + fdate.slice(3,5) + "-" + fdate.slice(0,2) + "T00:00:00";
						var f = fdate.slice(0, 2) + fdate.slice(3, 5) + fdate.slice(6, 10);
						return (f);
					},

					onDisplay: function(type, boolean) {
						switch (type) {
							case 1: //onClear Header
								this.headerType = 0;
								//this.header = ["Plant","ToE","ToP","C1","PoCA","C2","RC"];
								this.hflag = [0, 0, 0, 1, 0, 1, 0];
								this.onVisibleInvisble(["add", "sub", "C1", "C2", "FileUploaderId", "cancel"], false);
								this.onClearInputSelect(["C1", "C2", "RC"], ["Plant", "ToE", "ToP", "PoCA", "BUF"], ["rbg1", "rbg3", "rbg4"]);
								this.getView().byId("rbg2").setSelectedIndex(1);
								this.onC1();
								this.onToM();

								break;
							case 2: //onClear Detail
								//this.details = ["YPN","SN","SPN","MPN","MV","NS","NE","NBP","NPP","PR","NCVF","NCVU","DoCP","Project","CLC","CI","R"];
								//this.dflag = [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0];
								this.onVisibleInvisble(["add", "sub", "FileUploaderId"], boolean);
								this.onVisibleInvisble(["detail1", "cancel"], !boolean);
								this.onClearInputSelect(["YPN", "SN", "SPN", "MPN", "MV", "NS", "NE", "NBP", "NCVF", "NCVU", "CI", "R", "LT", "SQ", "MOQ"], ["PR",
									"DoCP", "NPP", "Project", "CLC", "Commodity"
								], ["PG", "Country"]);
								break;
							case 99: //Clear
								this.onDisplay(1, false);
								this.onDisplay(2, false);
								this.supplierNo = [];
								this.supplierNoCnt = [];
								this.partNo = [];
								this.partNoCnt = [];
								this.prefferedSupplier = "";
								this.DocNumber = "0000000000000000000000000";
								this.header = ["Plant", "ToE", "ToP", "C1", "PoCA", "C2", "RC", "BUF"];
								this.details = ["YPN", "SN", "SPN", "MPN", "MV", "NS", "NE", "NBP", "NPP", "PR", "NCVF", "NCVU", "DoCP", "Project", "CLC", "CI",
									"R", "Commodity", "LT", "SQ", "MOQ", "PG"
								];
								this.dflag = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
								this.LAST_CURRENCY = this.LAST_INCOTERMS = this.LAST_LANDING_FACTOR = this.UOM = "";
								this.LAST_PO_NO = this.LAST_UOM = this.MATERIAL_GROUP = this.YAZAKI_PART_DESC = "";
								this.CARLINE_NAME = this.CUSTOMER_CODE = this.CUSTOMER_NAME = "";
								this.NEW_CURRENCY = this.LAST_PO_PRICE = this.LAST_PRICESS_PER = this.LAST_SUPPLIER = "";
								this.TotalQuotationValue = this.LAST_CURR_RATE = this.LAST_LANDING_PRICE = this.NEW_CURRENCY_RATE = this.NEW_LANDING_FACTOR = 0;
								this.ASLPri = 0;
								this.MT = "D";
								this.onblankModel(["t1"]);
								this.getView().byId("ITB").setSelectedKey("H").setExpanded(true);
								break;
						}
					},

					onUpload: function(e) {
						this._import(e.getParameter("files") && e.getParameter("files")[0]);
					},

					_import: function(file) {
						var that = this;
						var excelData = {};
						if (file && window.FileReader) {
							var reader = new FileReader();
							reader.onload = function(e) {
								var data = e.target.result;
								var workbook = XLSX.read(data, {
									type: 'binary'
								});
								workbook.SheetNames.forEach(function(sheetName) {
									// Here is your object for every sheet in workbook
									excelData = XLSX.utils.sheet_to_row_object_array(workbook.Sheets[sheetName]);
									that.getBulkUploadData(excelData);
								});
							};
							reader.onerror = function(ex) {
								//console.log(ex);
								sap.m.MessageBox.show(ex, sap.m.MessageBox.Icon.WARNING, "Alert", [sap.m.MessageBox.Action.CLOSE]);
							};
							reader.readAsBinaryString(file);
						}
					},

					getBulkUploadData: function(excelData) {
						var that = this;
						var oInvoices1 = new sap.ui.model.json.JSONModel({
							"Pending": excelData
						});
						var len = oInvoices1.oData.Pending.length;
						var uploadtable1 = this.getView().byId("t1");
						oInvoices1.setSizeLimit(len);
						uploadtable1.setModel(oInvoices1);
						uploadtable1.bindAggregation("items", {
							path: "/Pending",
							template: new sap.m.ColumnListItem({
									cells: [
											// new sap.m.CheckBox({
											// 	selected: false
											// }),
											new sap.m.Text({
												text: "{Side}"
											}),
											new sap.m.Text({
												text: "{PlanDate}"
											}),
											new sap.m.Text({
												text: "{PlanTime}"
											}),
											new sap.m.Text({
												text: "{ActualDate}"
											}),
											new sap.m.Text({
												text: "{ActualTime}"
											}),
											new sap.m.Text({
												text: "{OnOffBloctTime}"
											}),
											new sap.m.Text({
												text: "{OnOffBloctTime(UTC)}"
											}),
											new sap.m.Text({
												text: "{Airline}"
											}),
											new sap.m.Text({
												text: "{FlightNo}"
											}),
											new sap.m.Text({
												text: "{Routing}"
											}),
											new sap.m.Text({
												text: "{Routing(Cities)}"
											})

										] // End of Cells aggregation of ColumnListItem control
								}) // End of ColumnListItem control
						});
					},
					createColumnConfig: function() {
						var aCols = [];
						var properties = ['Side', 'PlanDate', 'PlanTime', 'ActualDate', 'ActualTime'];

						for (var i = 0; i < properties.length; i++) {
							var property = properties[i];
							var column = {
								property: property,
								type: EdmType.String
							};
							aCols.push(column);

							// aCols.push({
							// 	// label: 'Full name',
							// 	property: 'Side'
							// 	// type: EdmType.String,
							// 	// template: '{0}, {1}'
							// });

							// aCols.push({
							// 	property: 'PlanDate',
							// 	type: EdmType.String
							// });

							// aCols.push({
							// 	property: 'PlanTime',
							// 	type: EdmType.String
							// });

							// aCols.push({
							// 	property: 'ActualDate',
							// 	type: EdmType.String
							// });

							// aCols.push({
							// 	property: 'ActualTime',
							// 	type: EdmType.String
							// });

							// aCols.push({
							// 	property: 'OnOffBloctTime',
							// 	type: EdmType.String
							// });

							// aCols.push({
							// 	property: 'Active',
							// 	type: EdmType.Boolean,
							// 	trueValue: 'YES',
							// 	falseValue: 'NO'
							// });
						}
							return aCols;
						},

						onExport: function() {
								var aCols, oRowBinding, oSettings, oSheet, oTable;

								if (!this._oTable) {
									this._oTable = this.byId('t1');
								}

								oTable = this._oTable;
								oRowBinding = oTable.getBinding('items');
								aCols = this.createColumnConfig();

								oSettings = {
									workbook: {
										columns: aCols,
										hierarchyLevel: 'Level'
									},
									dataSource: oRowBinding,
									fileName: 'Table export sample.xlsx',
									worker: false // We need to disable worker because we are using a MockServer as OData Service
								};

								oSheet = new Spreadsheet(oSettings);
								oSheet.build().finally(function() {
									oSheet.destroy();
								});
							},
							onDelete: function() {
								var that = this;
								var items = this.getView().byId("t1").getItems().length;
								if (items > 0) {
									MessageBox.warning("Are you sure you want to delete record?", {
										actions: [MessageBox.Action.OK, MessageBox.Action.CANCEL],
										emphasizedAction: MessageBox.Action.OK,
										onClose: function(sAction) {
											if (sAction === "OK") {
												that.onRemove();
											}
										}
									});
								}
							}
					});
			});