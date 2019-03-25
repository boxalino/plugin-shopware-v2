{block name="frontend_product_finder_content"}
    <div class="cpo-finder-wrapper loaded">
        {block name="frontend_product_finder_content_left"}
            <div class="cpo-finder-left">
                <div class="cpo-finder-left-content"></div>
            </div>
        {/block}

        <div class="cpo-finder-center">
            <div class="cpo-finder-center-content">
                <div class="cpo-finder-center-content-header"></div>
                <div class="cpo-finder-center-content-header-question cpo-finder-center-content-header-question-first"></div>
                <div class="cpo-finder-center-content-container"></div>
                <div class="cpo-finder-center-current-question-options"></div>
                <div class="cpo-finder-center-content-header-question cpo-finder-center-content-header-question-second"></div>
                <div class="cpo-finder-center-current-question-options-second"></div>
                <div class="cpo-finder-center-show-more-less"></div>
            </div>
            <div class="cpo-finder-button-container"></div>
            <div class="listingBlock cpo-finder-listing-container">
                <div class="cpo-finder-listing-wrapper">
                    {block name="frontend_cpo_finder_listing_present"}
                        <div class="cpo-finder-listing bx-present product--details" data-ajax-wishlist="true" data-compare-ajax="true"{if $theme.ajaxVariantSwitch} data-ajax-variants-container="true"{/if}>
                            {foreach $Data.highlighted_articles as $sArticle}
                                {include file="frontend/detail/content/header.tpl"}
                                {* Variable for tracking active user variant selection *}
                                {$activeConfiguratorSelection = true}
                                {if $sArticle.sConfigurator && ($sArticle.sConfiguratorSettings.type == 1 || $sArticle.sConfiguratorSettings.type == 2)}
                                    {* If user has no selection in this group set it to false *}
                                    {foreach $sArticle.sConfigurator as $configuratorGroup}
                                        {if !$configuratorGroup.selected_value}
                                            {$activeConfiguratorSelection = false}
                                        {/if}
                                    {/foreach}
                                {/if}

                                <div class="content product--details product--detail-upper block-group" data-ajax-wishlist="true" data-compare-ajax="true"{if $theme.ajaxVariantSwitch} data-ajax-variants-container="true"  data-ajax-bx-product-finder={$sArticle.articleID}{/if}>
                                    {* Product image *}
                                    {block name='frontend_detail_index_image_container'}
                                        <div class="product--image-container image-slider{if $sArticle.image && {config name=sUSEZOOMPLUS}} product--image-zoom{/if}"
                                                {if $sArticle.image}
                                            data-image-slider="true"
                                            data-image-gallery="true"
                                            data-maxZoom="{$theme.lightboxZoomFactor}"
                                            data-thumbnails=".image--thumbnails"
                                                {/if}>

                                            <span class="cpo-finder-listing-score">{s namespace="boxalino/intelligence" name="productfinder/score"}{/s} {$sArticle.bx_score}%</span>
                                            <progress class="cpo-finder-listing-score-progress" value="{$sArticle.bx_score}" max="100"></progress>
                                            {if !empty($sArticle.comment)}
                                                <button class="cpo-finder-listing-comment-button bxCommentButton_{$sArticle.articleID}" articleid="{$sArticle.articleID}">{s namespace="boxalino/intelligence" name="productfinder/commenticon"}{/s}</button>
                                                <div class="cpo-finder-listing-comment cpo-finder-listing-comment-{$sArticle.articleID}" style="display:none">
                                                    <div class="cpo-finder-listing-comment-text bxComment_{$sArticle.articleID}" style="">{$sArticle.comment}</div>
                                                    {if !empty({$sArticle.description})}
                                                        <div class="cpo-finder-listing-comment-description bxComment_{$sArticle.articleID}" style="">{$sArticle.description}</div>
                                                    {/if}
                                                </div>
                                            {/if}

                                            {include file="frontend/listing/product-box/product-image.tpl"}
                                        </div>
                                    {/block}

                                    {* "Buy now" box container *}
                                    {include file="frontend/detail/content/buy_container.tpl" Shop = $Data.shop}
                                    {block name='frontend_detail_actions'}{/block}
                                </div>
                            {/foreach}
                            {block name="frontend_cpo_finder_listing_present_after"}{/block}
                        </div>
                    {/block}
                    {block name="frontend_cpo_finder_listing_listing"}
                        {* {if $Data.highlighted_articles} *}
                        <div class="cpo-finder-listing bx-listing-emotion">
                            {foreach $Data.sArticles as $sArticle}
                                {include file="frontend/listing/box_article.tpl" productBoxLayout='image' isFinder='true'}
                            {/foreach}
                        </div>
                        {* {/if} *}
                    {/block}
                </div>
            </div>
        </div>

        <div class="cpo-finder-right">
            {block name="frontend_product_finder_content_right_main"}
                <div class="cpo-finder-right-content">
                    <div class="cpo-finder-right-title">{s namespace='boxalino/intelligence' name='productfinder/yourchoice'}Your choice{/s}</div>
                    <div class="cpo-finder-right-criteria"></div>
                    {block name="frontend_product_finder_content_right"}{/block}
                </div>
            {/block}
        </div>

        {block name="frontend_product_finder_content_below"}
            <div class="cpo-finder-button-container-below"></div>
        {/block}
    </div>
{/block}

{block name="frontend_product_finder_script"}
    <script>

        {block name="frontend_product_finder_script_templates"}
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

            var expertListHtml ='<div class="cpo-finder-expert cpo-finder-answer" id="%%ExpertFirstName%%%%ExpertLastName%%_button">' +
                '<div class="cpo-finder-expert-img-list">' +
                '<img src="https://%%ExpertSelectionImage%%">' +
                '</div>' +
                '<div class="cpo-finder-expert-name">' +
                '<h4>%%ExpertFirstName%% %%ExpertLastName%%</h4>' +
                '</div>' +
                '<div class="cpo-finder-expert-characteristics">' +
                '<ul>' +
                '<li><div="cpo-finder-expert-description">%%ExpertDescription%%</div></li>' +
                '</ul>' +
                '<div class="cpo-finder-expert-button">' +
                '<button type="button" name="button">{s namespace='boxalino/intelligence' name='productfinder/choose'}choose{/s}</button>' +
                '</div>' +
                '</div>';

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

            var additionalButton = '<button id="cpo-finder-additional" type="button" name="additionalButton">{s namespace='boxalino/intelligence' name='filter/morevalues'}more values{/s}</button>';
            var fewerButton = '<button id="cpo-finder-fewer" style="display: none;" type="button" name="fewerButton">{s namespace='boxalino/intelligence' name='filter/lessvalues'}less values{/s}</button>';
            var backButton = '<button id="cpo-finder-back" type="button" name="backButton">{s namespace='boxalino/intelligence' name='productfinder/back'}back{/s}</button>';
            var resultsButton = '<button id="cpo-finder-results" type="button" name="resultsButton">{s namespace='boxalino/intelligence' name='productfinder/advance'}advance{/s}</button>';
            var skipButton = '<button id="cpo-finder-skip"  type="button" name="backButton">{s namespace='boxalino/intelligence' name='productfinder/skip'}skip{/s}</button>';
            var showProductsButton = '<button id="cpo-finder-show-products" style="">{s namespace='boxalino/intelligence' name='productfinder/showresultsuntil'}Show results until {/s} %%CurrentScore%% %</button>';
        {/block}

        {if !$Data.cpo_is_narrative}
            {include file="frontend/plugins/boxalino/product_finder/product_finder_js.tpl" Data = $Data}
            {block name="frontend_product_finder_script_effect_custom"}{/block}
        {/if}
    </script>
{/block}