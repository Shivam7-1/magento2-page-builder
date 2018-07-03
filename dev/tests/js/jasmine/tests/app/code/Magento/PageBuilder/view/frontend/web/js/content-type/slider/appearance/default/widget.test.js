/**
 * Copyright © Magento, Inc. All rights reserved.
 * See COPYING.txt for license details.
 */
define([
    'Magento_PageBuilder/js/content-type/slider/appearance/default/widget',
    'jquery'
], function (sliderWidgetInitializer, $) {
    'use strict';

    describe('Magento_PageBuilder/js/content-type/slider/appearance/default/widget', function () {
        it('Should call unslick if element has class slick-initialized', function () {
            var el = document.createElement('div');

            spyOn($.fn, 'slick');

            el.classList.add('slick-initialized');

            sliderWidgetInitializer(undefined, el);

            expect($.fn.slick).toHaveBeenCalledWith('unslick');
        });

        it('Should call slick on element based on its data', function () {
            var el = document.createElement('div');

            spyOn($.fn, 'slick');

            el.setAttribute('data-autoplay', 'true');
            el.setAttribute('data-autoplay-speed', 500);
            el.setAttribute('data-fade', 'true');
            el.setAttribute('data-is-infinite', 'true');
            el.setAttribute('data-show-arrows', 'true');
            el.setAttribute('data-show-dots', 'true');

            sliderWidgetInitializer(undefined, el);

            expect($.fn.slick).toHaveBeenCalledWith({
                autoplay: true,
                autoplaySpeed: 500,
                fade: true,
                infinite: true,
                arrows: true,
                dots: true
            });
        });
    });
});