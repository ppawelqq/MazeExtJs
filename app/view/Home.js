Ext.define("Labirynt.view.Home", {
    extend: "Ext.panel.Panel",
    alias: "widget.home",
    plugins: "viewport",

    initComponent: function () {
        var Home = this,
            data, plansza;


        Home.getFile = Ext.create({
            xtype: "panel",
            html: '<div><input type="file" id="file-input" /><pre id="file-content"></pre></div>'
        });

        Home.addList = Ext.create({
            xtype: "button",
            text: "Dodaj listener",
            handler: function () {
                document.getElementById('file-input').addEventListener('change', function readSingleFile(e) {
                    var file = e.target.files[0];
                    if (!file) {
                        return;
                    }
                    var reader = new FileReader();
                    reader.onload = function (e) {
                        var contents = e.target.result;
                        data = contents;
                    };
                    reader.readAsText(file);
                }, false);
            }
        });

        Home.lab = Ext.create({
            xtype: "panel",
            layout: {
                type: "vbox",
                align: "stretch"
            },
            items: []
        });

        Home.drawLab = Ext.create({
            xtype: "button",
            text: "Rysuj Plansze",
            handler: function () {
                var dataArray = data.split("\n"),
                    theNewBiggestValue = 0,
                    parsedArray = [];

                for (var q = 0; q < dataArray.length - 1; q++) {
                    parsedArray.push(dataArray[q].split(" "));
                }
                // znalezienie najwyżeszj wartości i zwiększeniu jej o 1 daje nam rozmiar labiryntu X/X
                for (var i = 0; i < parsedArray.length - 1; i++) {
                    for (var j = 0; j < parsedArray[i].length; j++) {
                        var splitedValue = dataArray[i].split(" ");

                        for (var z = 0; z < splitedValue.length; z++) {
                            var parsedToInt = parseInt(splitedValue[z]);

                            if (parsedToInt > theNewBiggestValue) {
                                theNewBiggestValue = splitedValue[z];
                            }
                        }
                    }
                }

                var lab = Home.createLab(theNewBiggestValue * theNewBiggestValue);

                plansza = lab; // tymczasowo



                Home.labPanel.removeAll();
                Home.labPanel.insert(1, lab);
            }
        });

        Home.drawPaths = Ext.create({
            xtype: "button",
            text: "Rysuj ściany",
            handler: function () {
                Home.createPaths(plansza, data);
            }
        });

        Home.drawCont = Ext.create({
            xtype: "button",
            text: "Rysuj obrys",
            handler: function () {
                Home.drawContour();
            }
        });

        Home.stepCmp = Ext.create({
            xtype: "button",
            text: "Zrob krok",
            handler: function () {
                Home.makeStep();
            }
        });
        Home.labPanel = Ext.create({
            xtype: "panel",
            flex: 1,
            items: []
        });

        Home.pointX = Ext.create({
            xtype: "textfield",
            fieldLabel: "Podaj X "
        });
        Home.pointY = Ext.create({
            xtype: "textfield",
            fieldLabel: "Podaj Y "
        });
        Home.endX = Ext.create({
            xtype: "textfield",
            fieldLabel: "Podaj X "
        });
        Home.endY = Ext.create({
            xtype: "textfield",
            fieldLabel: "Podaj Y "
        });

        Home.startDataPanel = Ext.create({
            xtype: "panel",
            layout: {
                type: "hbox",
                align: "stretch"
            },
            items: [{
                xtype: "fieldset",
                title: "Wejście",
                layout: {
                    type: "vbox",
                    align: "stretch"
                },
                items: [Home.pointX, Home.pointY]
            }, {
                xtype: "fieldset",
                title: "Wyjście",
                layout: {
                    type: "vbox",
                    align: "stretch"
                },
                items: [Home.endX, Home.endY]
            }],
            dockedItems: [{
                xtype: "toolbar",
                dock: "bottom",
                items: [{
                    xtype: "button",
                    dock: "bottom",
                    width: 300,
                    text: "Wczytaj wejscie",
                    handler: function () {
                        if (!Home.pointX.getValue() || !Home.pointY.getValue()) {
                            Ext.Msg.show({
                                title: "Komunikat",
                                message: "Podaj X i Y ",
                                buttons: Ext.Msg.OK,
                                icon: Ext.Msg.OK
                            });
                        } else {
                            Home.setStart(Home.pointX.getValue(), Home.pointY.getValue());
                        }
                    }
                }, {
                    xtype: "button",
                    dock: "bottom",
                    width: 300,
                    text: "Wczytaj wyjscie",
                    handler: function () {
                        if (!Home.pointX.getValue() || !Home.pointY.getValue()) {
                            Ext.Msg.show({
                                title: "Komunikat",
                                message: "Podaj X i Y ",
                                buttons: Ext.Msg.OK,
                                icon: Ext.Msg.OK
                            });
                        } else {
                            Home.setStop(Home.endX.getValue(), Home.endY.getValue());
                        }
                    }
                }]
            }]
        });

        Home.dockedItems = Ext.create({
            xtype: "toolbar",
            dock: "top",
            items: [Home.getFile, Home.addList, Home.drawLab, Home.drawPaths, Home.drawCont, Home.stepCmp]
        });

        Home.items = [Home.startDataPanel, Home.labPanel];
        Home.callParent(arguments);
    },
    /**
     * TODO
     */
    createLab: function (theNewBiggestValue) {
        var panelArr = [],
            panelObj = {},
            btnArr = [],
            btnObj = {};

        for (var i = 0; i < theNewBiggestValue; i++) {
            btnArr = [];
            panelObj = {
                xtype: "panel",
                layout: {
                    type: "hbox",
                    align: "stretch"
                },
                items: []
            };
            panelArr.push(panelObj);
            for (var k = 0; k < theNewBiggestValue; k++) {
                if (i === 0 || (i % 2) === 0) {
                    var beforeValue = btnArr.length / 2;
                    var value;

                    if (Number.isInteger(beforeValue)) {
                        value = beforeValue + ", " + i / 2;
                    } else {
                        value = "";
                    }
                    btnObj = {
                        xtype: "button",
                        text: value,
                        isWall: false,
                        visitCount: 0,
                        flex: 1,
                        style: {
                            background: "#ffa64d;"
                        }
                    };
                } else {
                    btnObj = {
                        xtype: "button",
                        text: " ",
                        isWall: false,
                        visitCount: 0,
                        flex: 1,
                        style: {
                            background: "#ffa64d;"
                        }
                    };
                }
                btnArr.push(btnObj);
            }
            panelArr[i].items = btnArr;
        }

        return panelArr;
    },
    createPaths: function (lab, data) {
        var Home = this,
            splitedData = data.split("\n");

        var rowPanels = Home.labPanel.items.items;
        //console.log(splitedData.length);

        for (var d = 0; d < splitedData.length - 1; d++) {
            var stringLine = splitedData[d].split(" "),
                findBtnText = stringLine[0] + ", " + stringLine[1],
                operation = parseInt(stringLine[2]);

            for (var i = 0; i < rowPanels.length - 1; i++) {
                for (var j = 0; j < rowPanels[i].items.items.length; j++) {
                    if (rowPanels[i].items.items[j].text === findBtnText) {
                        switch (operation) {
                        case 0:
                            rowPanels[i].items.items[j].setStyle({
                                background: "#66ff66"
                            });

                            rowPanels[i].items.items[j].isWall = true;

                            rowPanels[i + 1].items.items[j].setStyle({
                                background: "#66ff66"
                            });
                            rowPanels[i + 1].items.items[j].isWall = true;

                            rowPanels[i + 2].items.items[j].setStyle({
                                background: "#66ff66"
                            });
                            rowPanels[i + 2].items.items[j].isWall = true;

                            rowPanels[i].items.items[j].setStyle({
                                background: "#66ff66"
                            });
                            rowPanels[i].items.items[j].isWall = true;

                            rowPanels[i].items.items[j + 1].setStyle({
                                background: "#66ff66"
                            });
                            rowPanels[i].items.items[j + 1].isWall = true;

                            rowPanels[i].items.items[j + 2].setStyle({
                                background: "#66ff66"
                            });
                            rowPanels[i].items.items[j + 2].isWall = true;
                            break;
                        case 1:
                            rowPanels[i].items.items[j].setStyle({
                                background: "#66ff66"
                            });
                            rowPanels[i].items.items[j].isWall = true;

                            rowPanels[i + 1].items.items[j].setStyle({
                                background: "#66ff66"
                            });
                            rowPanels[i + 1].items.items[j].isWall = true;

                            rowPanels[i + 2].items.items[j].setStyle({
                                background: "#66ff66"
                            });
                            rowPanels[i + 2].items.items[j].isWall = true;
                            break;
                        case 2:
                            rowPanels[i].items.items[j].setStyle({
                                background: "#66ff66"
                            });
                            rowPanels[i].items.items[j].isWall = true;

                            rowPanels[i].items.items[j + 1].setStyle({
                                background: "#66ff66"
                            });
                            rowPanels[i].items.items[j + 1].isWall = true;

                            rowPanels[i].items.items[j + 2].setStyle({
                                background: "#66ff66"
                            });
                            rowPanels[i].items.items[j + 2].isWall = true;
                            break;
                        case 3:
                            break;
                        }
                    }
                }
            }
        }
    },
    drawContour: function () {
        var Home = this,
            rowPanels = Home.labPanel.items.items,
            i, j;

        // top panel
        for (i = 0; i < rowPanels[0].items.items.length; i++) {
            rowPanels[0].items.items[i].setStyle({
                background: "#66ff66"
            });
            rowPanels[0].items.items[i].isWall = true;
        }

        // bottom panel
        for (i = 0; i < rowPanels[rowPanels.length - 1].items.items.length; i++) {
            rowPanels[rowPanels.length - 1].items.items[i].setStyle({
                background: "#66ff66"
            });
            rowPanels[rowPanels.length - 1].items.items[i].isWall = true;
        }

        // right side
        for (i = 0; i < rowPanels.length; i++) {
            for (j = 0; j < rowPanels[i].items.items.length; j++) {
                rowPanels[i].items.items[rowPanels[i].items.items.length - 1].setStyle({
                    background: "#66ff66"
                });
                rowPanels[i].items.items[rowPanels[i].items.items.length - 1].isWall = true;
            }
        }

        // left side
        for (i = 0; i < rowPanels.length; i++) {
            for (j = 0; j < rowPanels[i].items.items.length; j++) {
                rowPanels[i].items.items[0].setStyle({
                    background: "#66ff66"
                });
                rowPanels[i].items.items[0].isWall = true;
            }
        }
    },
    setStart: function (x, y) {
        var Home = this,
            rowPanels = Home.labPanel.items.items;

        rowPanels[y * 2].items.items[x * 2].setStyle({
            background: "red"
        });
        rowPanels[y * 2].items.items[x * 2].setText("self");
    },
    setStop: function (x, y) {
        var Home = this,
            rowPanels = Home.labPanel.items.items;

        rowPanels[y * 2].items.items[x * 2].setStyle({
            background: "#ffa64d"
        });
        rowPanels[y * 2].items.items[x * 2].setText("WYJSCIE");
    },
    makeStep: function () {
        var Home = this,
            rowPanels = Home.labPanel.items.items,
            me,
            top, bottom, left, right, i, j;

        for (i = 0; i < rowPanels.length - 1; i++) {
            for (j = 0; j < rowPanels[i].items.items.length; j++) {
                if (rowPanels[i].items.items[j].text === "self" && !me) {

                    // sasiedzi
                    right = rowPanels[i].items.items[j + 1].isWall;
                    left = (j > 0) ? rowPanels[i].items.items[j - 1].isWall : true;
                    top = rowPanels[i - 1].items.items[j].isWall;
                    bottom = rowPanels[i + 1].items.items[j].isWall;

                    if (rowPanels[i].items.items[j + 1].text === "WYJSCIE" ||
                        //rowPanels[i].items.items[j - 1].text === "WYJSCIE" ||
                        rowPanels[i - 1].items.items[j].text === "WYJSCIE" ||
                        rowPanels[i + 1].items.items[j].text === "WYJSCIE"
                    ) {
                        Ext.Msg.show({
                            title: "Komuniat",
                            message: "Udalo sie wyjsc z labiryntu",
                            buttons: Ext.Msg.OK
                        });
                    }

                    var bestPath = {};
                    // wybranie najlepszej drogi
                    if (!right) {
                        if (!bestPath.visitCount && bestPath.visitCount !== 0) {
                            bestPath.visitCount = 0;
                        }
                        bestPath = {
                            goto: "right",
                            visitCount: rowPanels[i].items.items[j + 1].visitCount
                        };
                    }

                    if (!bottom) {
                        if (!bestPath.visitCount && bestPath.visitCount !== 0) {
                            bestPath.visitCount = 99;
                        }
                        if (bestPath.visitCount >= rowPanels[i + 1].items.items[j].visitCount) {
                            bestPath = {};
                            bestPath = {
                                goto: "bottom",
                                visitCount: rowPanels[i + 1].items.items[j].visitCount
                            };

                        }
                    }

                    if (!top) {
                        if (!bestPath.visitCount && bestPath.visitCount !== 0) {
                            bestPath.visitCount = 99;
                        }

                        if (bestPath.visitCount >= rowPanels[i - 1].items.items[j].visitCount) {
                            bestPath = {};
                            bestPath = {
                                goto: "top",
                                visitCount: rowPanels[i - 1].items.items[j].visitCount
                            };
                        }
                    }

                    if (!left) {
                        if (!bestPath.visitCount && bestPath.visitCount !== 0) {
                            bestPath.visitCount = 99;
                        }
                        if (bestPath.visitCount >= rowPanels[i].items.items[j - 1].visitCount) {
                            bestPath = {};
                            bestPath = {
                                goto: "left",
                                visitCount: rowPanels[i].items.items[j - 1].visitCount
                            };
                        }
                    }

                    switch (bestPath.goto) {

                    case "right":
                        rowPanels[i].items.items[j + 1].setStyle({
                            background: "red"
                        });
                        rowPanels[i].items.items[j + 1].setText("self");
                        rowPanels[i].items.items[j].setText("@");
                        rowPanels[i].items.items[j].visitCount++;
                        me = rowPanels[i].items.items[j + 1];
                        break;
                    case "bottom":
                        rowPanels[i + 1].items.items[j].setStyle({
                            background: "red"
                        });
                        rowPanels[i + 1].items.items[j].setText("self");
                        rowPanels[i].items.items[j].setText("@");
                        rowPanels[i].items.items[j].visitCount++;
                        me = rowPanels[i + 1].items.items[j];
                        break;
                    case "top":
                        rowPanels[i - 1].items.items[j].setStyle({
                            background: "red"
                        });
                        rowPanels[i - 1].items.items[j].setText("self");
                        rowPanels[i].items.items[j].setText("@");
                        me = rowPanels[i].items.items[j].visitCount++;
                        break;
                    case "left":
                        rowPanels[i].items.items[j - 1].setStyle({
                            background: "red"
                        });
                        rowPanels[i].items.items[j - 1].setText("self");
                        rowPanels[i].items.items[j].setText("@");
                        me = rowPanels[i].items.items[j].visitCount++;
                        break;
                    }
                }
            }
        }
    }
});