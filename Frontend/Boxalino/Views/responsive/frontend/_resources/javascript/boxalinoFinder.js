(function(factory) {
    window.bxFinder = factory;
} (function() {
    function init() {
        var lang  = '',
            url = '',
            facets = {},
            max_score = 0,
            currentFacet = null,
            previousFacet = null,
            highlighted = false,
            questions = {},
            selectedValues = {},
            selects = {},
            combinedQuestions = [],
            expertFieldName="bxi_expert",
            expertFacetValues = [],
            expertFieldOrder = 0,
            defaultExpert = null,
            selectedExpert = null,
            alertString = "",
            additionalButton = "",
            expertListHtml = "",
            fewerButton = "",
            backButton = "",
            resultsButton = "",
            skipButton = "",
            showProductsButton = "",
            configuratorMessage = "";

        var expertLeftHtml ='<div class="cpo-finder-expert-img">' +
            '<img src="https://%%ExpertQuestionImage%%" />' +
            '</div>' +
            '<div class="cpo-finder-expert-text">'+
            '<div class="cpo-finder-expert-name">' +
            '<h4>%%ExpertFirstName%% %%ExpertLastName%%</h4>' +
            '</div>' +
            '</div>';

        var checkboxImageWithLabel ='<div class="cpo-finder-answer">' +
            '<img class="cpo-finder-answer-image-with-label" src="https://%%AnswerImage%%">' +
            '<div class="cpo-finder-answer-text">' +
            '<input class="%%FieldValue%%_check cpo-finder-answer-multiselect" type="checkbox" name="%%AnswerCheckboxName%%" value="%%AnswerCheckboxValue%%" %%AnswerCheckboxChecked%%> <div></div><span>%%AnswerText%%</span>' +
            '</div>' +
            '</div>';

        var checkboxLabelWithoutImage = '<div class="cpo-finder-answer">' +
            '<div class="cpo-finder-answer-text">'+
            '<input class="%%FieldValue%%_check cpo-finder-answer-multiselect" type="checkbox"name="%%AnswerCheckboxName%%" value="%%AnswerCheckboxValue%%" %%AnswerCheckboxChecked%%> <div></div><span>%%AnswerText%%</span>' +
            '</div>' +
            '</div>';

        var radioImageWithLabel =   '<div class="cpo-finder-answer">' +
            '<img class="cpo-finder-answer-image-with-label" src="https://%%AnswerImage%%">' +
            '<div class="cpo-finder-answer-text">' +
            '<input class="%%FieldValue%%_check cpo-finder-answer-radio" type="radio"name="%%AnswerCheckboxName%%" value="%%AnswerCheckboxValue%%" %%AnswerCheckboxChecked%%> <div></div><span>%%AnswerText%%</span>' +
            '</div>' +
            '</div>';

        var radioLabelWithoutImage =   '<div class="cpo-finder-answer">' +
            '<div class="cpo-finder-answer-text">' +
            '<input class="%%FieldValue%%_check cpo-finder-answer-radio" type="radio"name="%%AnswerCheckboxName%%" value="%%AnswerCheckboxValue%%" %%AnswerCheckboxChecked%%> <div></div><span>%%AnswerText%%</span>' +
            '</div>' +
            '</div>';

        var expertHtml ='<div class="cpo-finder-expert-img">' +
            '<img src="https://%%ExpertQuestionImage%%" />' +
            '</div>' +
            '<div class="cpo-finder-expert-text">' +
            '<div class="cpo-finder-expert-name">' +
            '<h4>%%ExpertFirstName%% %%ExpertLastName%%</h4>' +
            '</div>' +
            '<div class="cpo-finder-expert-persona">' +
            '<p>%%ExpertPersona%%</p>' +
            '</div>' +
            '</div>';

        function init(facetsJson, locale, controller, score, highlight, alert) {
            max_score = score;
            highlighted = (highlight=="true");
            alertString = alert;
            lang = locale;
            url = controller;
            facets = new bxFacets();
            facets.init(facetsJson);

            $.unsubscribe('plugin/swAutoSubmit/onChangeSelection');
            $.unsubscribe('plugin/swAjaxVariant/onChange');
            $.unsubscribe('plugin/swAutoSubmit/onRegisterEvents');

            questions = prepareQuestions();
            currentFacet = getCurrentFacet();
            previousFacet = getPreviousFacet();
            selects = facets.getCurrentSelects();

            prepareSelectionHistory();
            combinedQuestions = identifyCombinedQuestions(facets);

            expertFieldName = facets.getDataOwnerFacet();
            expertFacetValues = facets.getFacetValues(expertFieldName)[expertFieldName];
            expertFieldOrder = getExpertFieldOrder();
            selectedExpert = defaultExpert = getDefaultExpert();
        }

        function setExpertListHtml(html){
            expertListHtml = html;
        }

        function setConfiguratorMessageHtml(html){
            configuratorMessage = html;
        }

        function setAdditionalButtonHtml(html, id){
            if(id===undefined){
                id="cpo-finder-additional";
            }
            additionalButton = html.replace('%%ID%%', id);
        }

        function setFewerButtonHtml(html, id){
            if(id===undefined){
                id="cpo-finder-fewer";
            }
            fewerButton = html.replace('%%ID%%', id);
        }

        function setBackButtonHtml(html, id){
            if(id===undefined){
                id="cpo-finder-back";
            }
            backButton = html.replace('%%ID%%', id);
        }

        function setResultsButtonHtml(html, id){
            if(id===undefined){
                id="cpo-finder-results";
            }
            resultsButton = html.replace('%%ID%%', id);
        }

        function setSkipButtonHtml(html, id){
            if(id===undefined){
                id="cpo-finder-skip";
            }
            skipButton = html.replace('%%ID%%', id);
        }

        function setShowProductsButtonHtml(html, id){
            if(id===undefined){
                id="cpo-finder-show-products";
            }
            showProductsButton = html.replace('%%ID%%', id);
        }

        function createView(){
            if (currentFacet == expertFieldName) {
                createExpert(".cpo-finder-left-content", expertHtml, defaultExpert);
                expertFacetValues.forEach(function(value) {
                    if (facets.getFacetValueExtraInfo(expertFieldName, value, 'is-initial') != true && facets.getFacetValueExtraInfo(expertFieldName, value, 'active') != false) {
                        createExpert(".cpo-finder-center-content-container", expertListHtml, value);
                        createExpertFieldListener(value);
                    }
                });

                addIntroMessage(defaultExpert);
                createButton();
            } else {
                var templateToUse = expertLeftHtml;
                if (combinedQuestions.length > 1) {
                    templateToUse = expertHtml;
                    jQuery('.cpo-finder-right-content').hide();
                    combinedQuestions.forEach(function(temp) {
                        var tempFacetValues = facets.getFacetValues(temp)[temp];
                    });
                }
                selectedExpert = createExpert(".cpo-finder-left-content", templateToUse, "");
                addIntroMessage(selectedExpert);
                createFields();
                createButton();
            }

            disableVariantSwitcher();

            $('#cpo-finder-results').on('click', function (e) {
                var proceedToNextQuestion;
                var forceAnswer = facets.getFacetExtraInfo(currentFacet, 'finderForceAnswer');
                if (combinedQuestions.length > 1){
                    combinedQuestions.forEach(function (question) {
                        if(facets.getCurrentSelects(question) == null){
                            proceedToNextQuestion = false;
                        } else {
                            proceedToNextQuestion = true;
                        }
                    })
                } else if(forceAnswer){
                    if(facets.getCurrentSelects(currentFacet) == null){
                        proceedToNextQuestion = false;
                    } else {
                        proceedToNextQuestion = true;
                    }
                } else{
                    proceedToNextQuestion = true;
                }

                if (proceedToNextQuestion == false){
                    window.alert(alertString);
                } else {
                    if(facets.getCurrentSelects(currentFacet) == null){
                        skipQuestion();
                    }
                    goToNextQuestion();
                }
            });

            $('#cpo-finder-skip').on('click', function(e) {
                skipQuestion();
            });

            $('#cpo-finder-back').on('click', function(e) {
                window.history.back();
            });

            var useClickEventOnShowRecommendedProducts = facets.getFacetExtraInfo(currentFacet, 'finderShowProductsOnClick');
            var showRecommendedProducts = facets.getFacetExtraInfo(currentFacet, 'finderShowProductsDisable');
            if(useClickEventOnShowRecommendedProducts==true) {
                $('#cpo-finder-show-products').on('click', function() {
                    toggleProducts();
                });
            } else if(showRecommendedProducts==null && currentFacet!=null) {
                $('#cpo-finder-show-products').hide();
                $(".bx-finder-template-showProducts").insertBefore($(".cpo-finder-listing-wrapper")).show();
                toggleProducts();
            } else {}

            var previousFacetDisabledProducts = facets.getFacetExtraInfo(previousFacet, 'finderShowProductsDisable');
            var currentFacetDisabledProducts = facets.getFacetExtraInfo(currentFacet, 'finderShowProductsDisable');
            var currentFacetNotification = facets.getFacetExtraInfo(currentFacet, 'finderShowNotification');
            if((previousFacetDisabledProducts!=null && currentFacetDisabledProducts==null) || currentFacetNotification!=null) {
                jQuery('.cpo-finder-center-content-notification').append($(".bx-finder-template-notification").show());
            }

            jQuery('.cpo-finder-listing-comment-button').on('click', function() {
                if (jQuery(this).hasClass('comment-active') ){
                    jQuery(this).removeClass('comment-active');
                    currentArticleID = '.cpo-finder-listing-comment-' + jQuery(this).attr('articleid');
                    jQuery(currentArticleID).hide();
                } else {
                    jQuery(this).addClass('comment-active');
                    currentArticleID = '.cpo-finder-listing-comment-' + jQuery(this).attr('articleid');
                    jQuery(currentArticleID).show();
                }
            });

            $(".cpo-finder-wrapper").fadeIn(100);
        }

        function disableVariantSwitcher(){
            var messageElement = $(".bx-finder-template-configuratorMessage");
            jQuery(".variant--option").each(function(i, obj) {
                obj.getElementsByTagName('input')[0].removeAttribute("data-auto-submit");
                var optionView = obj.cloneNode(true);
                obj.parentNode.replaceChild(optionView, obj);
            });

            $(".configurator--form").removeAttr("action");
            $(".configurator--form").click(function(event) {
                $.unsubscribe('plugin/swAjaxVariant/onChange');
                event.preventDefault();
                return false;
            });

            $(".variant--option").click(function(event) {
                var selectedOptionEl = event.target;
                var selectedOptionForm = $(selectedOptionEl).closest('form');
                if(selectedOptionEl.getAttribute("checked")=="checked") {
                    messageElement.fadeOut("fast");
                } else {
                    messageElement.insertAfter(selectedOptionForm).fadeIn(50);
                    setTimeout(function(){messageElement.hide();},5000);
                }
            });
        }

        function createFallbackView(){
            $(".cpo-finder-wrapper-fallback").fadeIn(100);
        }

        function identifyCombinedQuestions(facets){
            if (questions[0] == currentFacet && facets.getCurrentSelects().length == undefined && facets.getCurrentSelects(questions[1]) == null) {
                return [questions[0], questions[1]];
            }
            return [];
        }

        function createExpertFieldListener(value) {
            var expertFirstName = facets.getFacetValueExtraInfo(expertFieldName, value, 'first-name').replace(' ', '');
            var expertLastName = facets.getFacetValueExtraInfo(expertFieldName, value, 'last-name');
            jQuery('#' + expertFirstName + expertLastName + '_button').on('click', function() {
                facets.removeSelect(expertFieldName);
                facets.addSelect(expertFieldName, value);
                var params = facets.getFacetParameters();
                params.forEach(function(param, index) {
                    if (index > 0) {
                        url += '&';
                    } else {
                        url += '?'
                    }
                    if (param.indexOf('=') === -1) {
                        url += param + '=100';
                    } else {
                        url += param;
                    }
                });
                window.location = url;
            });
        }

        function addIntroMessage() {
            var expertIntroSentence = facets.getFacetValueExtraInfo(expertFieldName, selectedExpert, 'intro-sentence');
            var expertQuestionSentence = facets.getFacetValueExtraInfo(expertFieldName, selectedExpert, 'question-sentence');
            if (currentFacet != null) {
                var facetLabel = facets.getFacetExtraInfo(currentFacet, 'finderQuestion');
                if(currentFacet == expertFieldName) {
                    var dataOwnerHeader = facets.getFacetExtraInfo(currentFacet, 'dataOwnerHeader');
                    jQuery('.cpo-finder-center-content-header').append(dataOwnerHeader);
                } else if (currentFacet == questions[expertFieldOrder+1]) {
                    jQuery('.cpo-finder-center-content-header').append(expertIntroSentence[lang]);
                    jQuery('.cpo-finder-center-content-header-question-first').append(facetLabel);
                    if (combinedQuestions.length > 1) {
                        jQuery('.cpo-finder-center-content-header-question-second').append(facets.getFacetExtraInfo(combinedQuestions[1], 'finderQuestion'));
                    }
                } else {
                    jQuery('.cpo-finder-center-content-header').append(expertQuestionSentence[lang]);
                    jQuery('.cpo-finder-center-content-header-question-first').append(facetLabel);
                    if (combinedQuestions.length > 1) {
                        jQuery('.cpo-finder-center-content-header-question-second').append(facets.getFacetExtraInfo(combinedQuestions[1], 'finderQuestion'));
                    }
                }
            }
        }

        function createExpert(locationClass, templateHtml, selectedExpert) {
            if(selectedExpert != "") {
                selectedExpert = selectedExpert;
            } else if(facets.getCurrentSelects(expertFieldName) && facets.getCurrentSelects(expertFieldName) !='*') {
                selectedExpert = facets.getCurrentSelects(expertFieldName)[0];
            } else {
                selectedExpert = defaultExpert;
            }

            var expertQuestionImg = facets.getFacetValueExtraInfo(expertFieldName, selectedExpert, 'question-img');
            var expertFirstName = facets.getFacetValueExtraInfo(expertFieldName, selectedExpert, 'first-name').replace(' ', '');
            var expertLastName = facets.getFacetValueExtraInfo(expertFieldName, selectedExpert, 'last-name');
            var expertPersona = facets.getFacetValueExtraInfo(expertFieldName, selectedExpert, 'persona');
            var expertExpertise = facets.getFacetValueExtraInfo(expertFieldName, selectedExpert, 'expertise');
            var expertCharacteristics = facets.getFacetValueExtraInfo(expertFieldName, selectedExpert, 'characteristics');
            var selectionImg = facets.getFacetValueExtraInfo(expertFieldName, selectedExpert, 'selection-img');
            var description = facets.getFacetValueExtraInfo(expertFieldName, selectedExpert, 'desciption');
            var badges = facets.getFacetValueExtraInfo(expertFieldName, selectedExpert, 'badges');

            jQuery(locationClass).append(
                templateHtml.replace('%%ExpertFirstName%%', expertFirstName)
                    .replace('%%ExpertLastName%%', expertLastName)
                    .replace('%%ExpertFirstName%%', expertFirstName)
                    .replace('%%ExpertLastName%%', expertLastName)
                    .replace('%%ExpertDescription%%', description[lang])
                    .replace('%%ExpertBadges%%', badges[lang])
                    .replace('%%ExpertPersona%%', expertPersona[lang])
                    .replace('%%ExpertExpertise%%', expertExpertise[lang])
                    .replace('%%Characteristics0%%', expertCharacteristics[0]['alt-text'][lang])
                    .replace('%%Characteristics0Value%%', expertCharacteristics[0]['property'][lang])
                    .replace('%%Characteristics1%%', expertCharacteristics[1]['alt-text'][lang])
                    .replace('%%Characteristics1Value%%', expertCharacteristics[1]['property'][lang])
                    .replace('%%Characteristics2%%', expertCharacteristics[2]['alt-text'][lang])
                    .replace('%%Characteristics2Value%%', expertCharacteristics[2]['property'][lang])
                    .replace('%%ExpertQuestionImage%%', expertQuestionImg)
                    .replace('%%ExpertSelectionImage%%', selectionImg)
            );

            jQuery(".icon-expert").each(function(i, obj) {
                jQUery(".icon-expert").html($(obj).html().replace('%%ExpertSelectionImage%%', selectionImg));
            });

            return selectedExpert;
        }


        function createFields() {
            if (combinedQuestions.length > 1) {
                var containerCombined = jQuery('.cpo-finder-center-current-question-options-second');

                var fieldCombinedContainer = jQuery('<div class="' + combinedQuestions[1] + '_container cpo-finder-answers-container-second"></div>');
                var facetCombinedValues = facets.getFacetValues(combinedQuestions[1])[combinedQuestions[1]];
                var visualisationCombined = facets.getFacetExtraInfo(combinedQuestions[1], 'visualisation');

                fieldCombinedContainer.append(createField(combinedQuestions[1], visualisationCombined, facetCombinedValues));
                containerCombined.append(fieldCombinedContainer);

                facets.getFacets().forEach(function (fieldName) {
                    createFieldListener(fieldName);
                });

                var displayCombinedSize = facets.getFacetExtraInfo(combinedQuestions[1], 'enumDisplayMaxSize');
                var secondCombinedDisplaySize = facets.getFacetExtraInfo(combinedQuestions[0], 'enumDisplayMaxSize');
                if (secondCombinedDisplaySize == null) {
                    secondCombinedDisplaySize = facets.getFacetValues(currentFacet)[currentFacet].length;
                }
                var combinedDisplaySize = parseInt(secondCombinedDisplaySize) + parseInt(displayCombinedSize);
                var totalFacetLength = parseInt(facets.getFacetValues(currentFacet)[currentFacet].length) + parseInt(facetCombinedValues.length);

                if (combinedDisplaySize > totalFacetLength) {
                    $('.cpo-finder-answer:gt(' + (displayCombinedSize - 1) + ')').hide();

                    jQuery('.cpo-finder-center-show-more-less').append(additionalButton);
                    jQuery('.cpo-finder-center-show-more-less').append(fewerButton);
                    $('#cpo-finder-additional').on('click', function (e) {
                        $('.cpo-finder-answers-container-second cpo-finder-answer').show();
                        $('#cpo-finder-additional').hide();
                        $('#cpo-finder-fewer').show();
                    });
                    $('#cpo-finder-fewer').on('click', function (e) {
                        $('.cpo-finder-answer:gt(' + (combinedDisplaySize - 1) + ')').hide();
                        $('#cpo-finder-fewer').hide();
                        $('#cpo-finder-additional').show();
                    });
                }
            }

            var fieldContainer = jQuery('<div class="' + currentFacet + '_container cpo-finder-answers-container"></div>');
            var facetValues = facets.getFacetValues(currentFacet)[currentFacet];
            var visualisation = facets.getFacetExtraInfo(currentFacet, 'visualisation');
            fieldContainer.append(createField(currentFacet, visualisation, facetValues));

            var container = jQuery('.cpo-finder-center-current-question-options');
            container.append(fieldContainer);

            facets.getFacets().forEach(function(fieldName) {
                createFieldListener(fieldName);
            });

            // only show as many as defined
            var displaySize = facets.getFacetExtraInfo(currentFacet, 'enumDisplayMaxSize');
            if (displaySize) {
                $('.cpo-finder-answer:gt(' + (displaySize - 1) + ')').hide();
            }
        }

        function createField(field, elementType, values) {
            var element = null;
            var facetLabel = facets.getFacetExtraInfo(field, 'finderQuestion');
            var displayMode = facets.getFacetExtraInfo(field, 'display-mode');
            var facetExtraInfo = facets.getFacetExtraInfo(field, 'facetValueExtraInfo');
            switch (elementType) {
                case 'multiselect':
                    element = $('<div></div>');
                    if (displayMode == 'imageWithLabel') {
                        values.forEach(function(value) {
                            var facetExtraInfoValues = facetExtraInfo[value];
                            var checked = facets.isFacetValueSelected(field, value) ? "checked='checked'" : "";
                            element.append($(checkboxImageWithLabel.replace('%%FieldValue%%', field)
                                .replace('%%AnswerImage%%', facetExtraInfoValues['image'])
                                .replace('%%AnswerText%%', facetExtraInfoValues['additional_text'])
                                .replace('%%AnswerCheckboxName%%', value)
                                .replace('%%AnswerCheckboxValue%%', value)
                                .replace('%%AnswerCheckboxChecked%%', checked)));
                        });
                    } else {
                        values.forEach(function(value) {
                            var checked = facets.isFacetValueSelected(field, value) ? "checked='checked'" : "";
                            element.append($(checkboxLabelWithoutImage.replace('%%FieldValue%%', field)
                                .replace('%%AnswerText%%', value)
                                .replace('%%AnswerCheckboxName%%', field)
                                .replace('%%AnswerCheckboxValue%%', value)
                                .replace('%%AnswerCheckboxChecked%%', checked)));
                        });
                    }
                    break;
                case 'radio':
                    element = $('<form></form>');
                    if (displayMode == 'imageWithLabel') {
                        values.forEach(function(value) {
                            var facetExtraInfoValues = facetExtraInfo[value];
                            var checked = facets.isFacetValueSelected(field, value) ? "checked='checked'" : "";
                            element.append($(radioImageWithLabel.replace('%%FieldValue%%', field)
                                .replace('%%AnswerImage%%', facetExtraInfoValues['image'])
                                .replace('%%AnswerText%%', facetExtraInfoValues['additional_text'])
                                .replace('%%AnswerCheckboxName%%', field)
                                .replace('%%AnswerCheckboxValue%%', value)
                                .replace('%%AnswerCheckboxChecked%%', checked)));
                        });
                    } else {
                        values.forEach(function(value) {
                            var checked = facets.isFacetValueSelected(field, value) ? "checked='checked'" : "";
                            element.append($(radioLabelWithoutImage.replace('%%FieldValue%%', field)
                                .replace('%%AnswerText%%', value)
                                .replace('%%AnswerCheckboxName%%', value)
                                .replace('%%AnswerCheckboxValue%%', value)
                                .replace('%%AnswerCheckboxChecked%%', checked)));
                        });
                    }
                    break;
                case 'dropdown':
                    element = $('<select class=' + field + ' name=' + field + '></select>'),
                        selectedValue = selectedValues.hasOwnProperty(field) ? selectedValues[field] : null;
                    element.append($('<option value="" disabled selected >Bitte wählen Sie aus.</option>'));
                    values.forEach(function(value) {
                        optionElement = $('<option></option>').attr("value", value).text(value);
                        if (facets.isFacetValueSelected(field, value)) {
                            optionElement.attr('selected', 'selected');
                        }
                        element.append(optionElement);
                    });
                    element = $('<span><strong>' + facetLabel + '</strong></span><br />').add(element);
                    break;
                case 'slider':
                    var res = values[0].split("-"),
                        selectedValue = facets.getCurrentSelects(field) === null ? res : facets.getCurrentSelects(field)[0].split("-");
                    var activeMin = selectedValue[0],
                        activeMax = selectedValue[1];
                    element = $('<div class="range-slider" data-range-slider="true" data-roundPretty="false" data-labelFormat="" data-stepCount="100" data-stepCurve="linear" data-startMin="' + activeMin + '" data-startMax="' + activeMax + '" data-rangeMin="' + res[0] + '" data-rangeMax="' + res[1] + '"></div>');
                    element.append($('<input type="hidden" id="min" name="min" data-range-input="min" value="' + res[0] + '"/>'));
                    element.append($('<input type="hidden" id="max" name="max" data-range-input="max" value="' + res[1] + '"/>'));
                    element.append($('<div class="filter-panel--range-info"> <span class="range-info--min"></span><label class="range-info--label" for="min" data-range-label="min"> ' + activeMin + '</label><span class="range-info--max"></span><label class="range-info--label" for="max" data-range-label="max"> ' + activeMax + '</label></div>'));
                case 'enumeration':
                    element = $('<div><div>');
                    values.forEach(function(value) {
                        var checked = facets.isFacetValueSelected(field, value) ? "checked='checked'" : "";
                        element.append($("<label>" + value + "</label><input class='" + field + "' " + checked + " type='radio' name='" + field + "' value='" + value + "'>"));
                    });
                    element = $('<span><strong>' + facetLabel + '</strong></span><br />').add(element);
                default:
                    break;
            }

            return element;
        }

        function createFieldListener(field) {
            var type = facets.getFacetExtraInfo(field, 'visualisation');
            $("." + field + "_check").on('change', function() {
                if (type == 'radio') {
                    facets.removeSelect(field);
                    if ($(this).is(':checked')) {
                        facets.addSelect(field, $(this).attr('value'));
                    } else {
                        facets.removeSelect(field);
                    }
                } else if (type == 'multiselect') {
                    if ($(this).is(':checked')) {
                        facets.addSelect(field, $(this).attr('value'));
                    } else {
                        facets.removeSelect(field, $(this).attr('value'));
                    }
                } else {
                    facets.removeSelect(field);
                    facets.addSelect(field, $(this).attr('value'));
                }
                update();
            });
        }

        function update() {
            var fields = facets.getUpdatedValues();
            for (var fieldName in fields) {
                var select = $('.' + fieldName).empty();
                var optionValues = fields[fieldName];
                optionValues.forEach(function(optionValue) {
                    select.append($('<option></option>').attr("value", optionValue).text(optionValue));
                });
            }
        }

        /**
         * if current facet is set. Create all buttons
         *  otherwise only show back button and show the products
         */
        function createButton() {
            if (currentFacet) {
                var displaySize = facets.getFacetExtraInfo(currentFacet, 'enumDisplayMaxSize');
                var facetValues = facets.getFacetValues(currentFacet)[currentFacet];

                // if maxsize is defined add the show more/less buttons
                if (displaySize && displaySize < facetValues.length) {
                    jQuery('.cpo-finder-center-show-more-less').append(additionalButton);
                    jQuery('.cpo-finder-center-show-more-less').append(fewerButton);
                    $('.cpo-finder-answer:gt(' + (displaySize - 1) + ')').hide();
                }

                $('#cpo-finder-additional').on('click', function(e) {
                    $('.cpo-finder-answer').show();
                    $('#cpo-finder-additional').hide();
                    $('#cpo-finder-fewer').show();
                });
                $('#cpo-finder-fewer').on('click', function(e) {
                    $('.cpo-finder-answer:gt(' + (displaySize - 1) + ')').hide();
                    $('#cpo-finder-fewer').hide();
                    $('#cpo-finder-additional').show();
                });

                if (questions[0] != currentFacet) {
                    jQuery('.cpo-finder-button-container').append(backButton);
                }

                var blockNext = facets.getFacetExtraInfo(currentFacet, 'finderContinueButtonDisable');
                if(blockNext==null){
                    jQuery('.cpo-finder-button-container').append(resultsButton);
                }

                var allowSkip = facets.getFacetExtraInfo(currentFacet, 'finderSkipButtonDisable');
                if(allowSkip==null) {
                    jQuery('.cpo-finder-button-container').append(skipButton);
                }

                var showRecommendedProducts = facets.getFacetExtraInfo(currentFacet, 'finderShowProductsDisable');
                if(showRecommendedProducts==null){
                    if(max_score > 0 && questions[0]!= currentFacet && questions[1]!= currentFacet && currentFacet != expertFieldName) {
                        jQuery('.cpo-finder-button-container-below').append(showProductsButton.replace('%%CurrentScore%%', max_score));
                    }
                }
            } else {
                jQuery('.cpo-finder-button-container').append(backButton);
                jQuery('.cpo-finder-button-container-below').hide();

                var expertResultSentence10 = facets.getFacetValueExtraInfo(expertFieldName, selectedExpert, 'sentence-result-level10');
                var expertResultSentence5 = facets.getFacetValueExtraInfo(expertFieldName, selectedExpert, 'sentence-results-level5');
                var expertResultSentence1 = facets.getFacetValueExtraInfo(expertFieldName, selectedExpert, 'sentence-results-level1');

                var selects = facets.getCurrentSelects();
                var count = 0;
                if (selects) {
                    for (var key in selects) {
                        if (key != 'bxi_data_owner_expert' && selects[key] != '*') {
                            count++;
                        }
                    }
                }
                if (highlighted == true) {
                    jQuery('.cpo-finder-center-content-header').append(expertResultSentence10[lang]);
                    $('.bx-present').show();
                    $('.bx-listing-emotion').show();
                } else {
                    jQuery('.cpo-finder-center-content-header').append(expertResultSentence5[lang]);
                    $('.bx-listing-emotion').show();
                }
            }
        }

        function toggleProducts(productClass){
            productClass = (productClass === undefined) ? ".cpo-finder-listing" : productClass;
            if($(productClass).css('display') == 'block'){
                $(productClass).hide();
            } else {
                $(productClass).show();
            }
        }

        function skipQuestion(){
            facets.removeSelect(currentFacet);
            facets.addSelect(currentFacet, '*');
            goToNextQuestion();
        }

        function goToNextQuestion(){
            var params = facets.getFacetParameters(),
                paramString = '',
                prefix = facets.getParameterPrefix();
            var contextPrefix = facets.getContextParameterPrefix();
            params.forEach(function(param, index) {
                if (index > 0) {
                    paramString += '&';
                } else {
                    paramString += '?'
                }
                if (param.indexOf('=') === -1) {
                    paramString += param + '=100';
                } else {
                    paramString += param;
                }
            });
            $('#cpo-finder-results').prop('disabled', true);
            window.location.search.substr(1).split("&").forEach(function(param, index) {
                if (param.indexOf(prefix) !== 0 && param.indexOf(contextPrefix) !== 0) {
                    bind = ((paramString === '') ? (index > 0 ? '&' : '?') : '&');
                    paramString += bind + param;
                }
            });
            window.location = window.location.origin + window.location.pathname + paramString;
        }

        function isExpertQuestion(element) { return element==expertFieldName;}

        function getDefaultExpert(){
            expertFacetValues.forEach(function(value) {
                if (facets.getFacetValueExtraInfo(expertFieldName, value, 'is-initial')) {
                    defaultExpert = value;
                }
            });

            return defaultExpert;
        }

        function prepareSelectionHistory(classLine, classContent){
            classLine = (classLine === undefined) ? ".cpo-finder-right-criteria" : classLine;
            classContent = (classContent === undefined) ? ".cpo-finder-right-content" : classContent;

            if (Object.keys(selects).length > 0) {
                jQuery(classLine).append('<br>');
                var bxUrl = window.location.href;
                var bxNewUrl = '';
                var bxUrlParamString = window.location.search.substring(1);
                var bxUrlParams = bxUrlParamString.split('&');
                var s = '';
                var emptyValues = 0;

                for (var key in selects) {
                    if (selects[key] =='*' || key == 'bxi_data_owner_expert') { emptyValues = emptyValues + 1; }
                    if (key != 'bxi_data_owner_expert' && selects[key] != '*') {
                        bxUrlParams.forEach(function(param) {
                            if (param.indexOf(key) > -1) {
                                bxNewUrl = bxUrl.substring(0, bxUrl.indexOf(param));
                            }
                        });
                        bxNewUrl = bxNewUrl.replace(url, '');
                        if(bxNewUrl.length == 1) { bxNewUrl = url;}
                        facetLabel = facets.getFacetLabel(key, lang);
                        jQuery(classLine).append('<b class="bx-finder-filter-label">' + facetLabel + '</b><br>');
                        // if there is additional info, use that
                        facetExtraInfo = facets.getFacetExtraInfo(key, 'facetValueExtraInfo');
                        if (facetExtraInfo && facetExtraInfo[selects[key]]) {
                            jQuery(classLine).append('<a href="' + bxNewUrl + '" class="' + key + ' bx-finder-filter-selected"><p id="' + selects[key] + '" class="bx-finder-filter-selected-value">- ' + facetExtraInfo[selects[key]]['additional_text'] + '</p></a>');
                        }
                        else {
                            selects[key].forEach(function(key) {
                                jQuery(classLine).append('<a href="' + bxNewUrl + '" class="' + key + ' bx-finder-filter-selected"><p id="' + key + '" class="bx-finder-filter-selected-value">- ' + key + '</p></a>');
                            });
                        }
                    }
                    if(emptyValues == Object.keys(selects).length) {
                        jQuery(classContent).hide();
                    }
                }
            } else {
                jQuery(classContent).hide();
            }
        }

        function prepareQuestions(){
            questions = facets.getAdditionalFacets();
            questions.forEach(function(question){
                if (facets.getFacetValues(question)[question].length === 0) {
                    var index = questions.indexOf(question);
                    if (index > -1) {
                        questions.splice(index, 1);
                    }
                }
            });

            return questions;
        }

        function getCurrentFacet(){
            for (var i = 0; i < questions.length; i++) {
                var fieldName = questions[i];
                if (facets.getCurrentSelects(fieldName) === null) {
                    if(facets.getFacetValues(fieldName)[fieldName].length < 2){
                        continue;
                    }
                    return fieldName;
                }
            }

            return null;
        }

        function getPreviousFacet(){
            var currentFacetOrder = questions.indexOf(currentFacet);
            if(currentFacetOrder>0){
                return questions[currentFacetOrder-1];
            }
            return null;
        }

        function getExpertFieldOrder(){
            var index = -1;
            for (var i = 0; i < questions.length; ++i) {
                if (questions[i] == expertFieldName) {
                    index = i;
                    break;
                }
            }

            return index;
        }

        return {
            init: init,
            createView: createView,
            setExpertListHtml: setExpertListHtml,
            setConfiguratorMessageHtml: setConfiguratorMessageHtml,
            setAdditionalButtonHtml: setAdditionalButtonHtml,
            setFewerButtonHtml: setFewerButtonHtml,
            setBackButtonHtml: setBackButtonHtml,
            setResultsButtonHtml: setResultsButtonHtml,
            setSkipButtonHtml: setSkipButtonHtml,
            setShowProductsButtonHtml: setShowProductsButtonHtml,
            createFallbackView : createFallbackView
        };
    }

    return init();
}));