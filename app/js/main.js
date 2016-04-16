(function($) {

    var arrowLeft = '<a href="#" class="glyphicon glyphicon-menu-left tabbarcarousel-arrow tabbarcarousel-arrow-left"></a>',
        arrowRight = '<a href="#" class="glyphicon glyphicon-menu-right tabbarcarousel-arrow tabbarcarousel-arrow-right"></a>';

    var tabsbarTransition = function(){

        if($('.sliding-tabs').length){

            /****** Slider *****/

            /**********************************************************/
            /**************** Carousel Sliding Tabs *******************/

            var setTabBarCarousel = function(){

                var tabsBarCarousel = $('.sliding-tabs-carousel'),
                    tabsBar = $('.sliding-tabs'),
                    tabWidth = $('.sliding-tabs-carousel ul li').css('width').replace(/[^-\d\.]/g, ''),
                    tabsWidth = tabsBar.find('li').length * tabWidth;

                tabsBarCarousel.find('.sliding-tabs').outerWidth(tabsWidth);

                var setArrowsHeight = function(){
                    var tabsBarHeight = tabsBar.height();
                    $('.tabbarcarousel-arrow').height(tabsBarHeight).css('line-height', tabsBarHeight + 'px');
                };

                tabsBarCarousel.append(arrowLeft);
                tabsBarCarousel.append(arrowRight);

                setArrowsHeight();

                var arrowsWidth = $('.tabbarcarousel-arrow').width();

                $(document).on('click', '.tabbarcarousel-arrow', function(e){

                    e.preventDefault();

                    var tabsBarPosition = tabsBar.position(),
                        go = tabWidth;

                    if($(this).hasClass('tabbarcarousel-arrow-left')){

                        // If left position is at the left limit, do nothing.
                        if(tabsBarPosition.left >= arrowsWidth)
                            return;

                        // If left position is between 16 (left limit) and -116 (two tabs), go to the left limit
                        if(tabsBarPosition.left < arrowsWidth && tabsBarPosition.left > (arrowsWidth - (tabWidth * 2)))
                            go = - tabsBarPosition.left + arrowsWidth;

                        tabsBar.stop().animate({
                            'left': "+=" + go
                        }, 400, function(){
                            toggleArrows();
                        });
                    }

                    if($(this).hasClass('tabbarcarousel-arrow-right')){

                        var carouselWidth = $('.sliding-tabs-carousel').outerWidth(),
                            diff = (tabsBarPosition.left + tabsWidth) - carouselWidth; // get the difference between the container's width and the tabs bar's width minus its left position.

                        // If the diff is smaller or equal to the arrow's width, it means it reached its right limit. Then do nothing.
                        if(diff <= - arrowsWidth)
                            return;

                        // If the diff is between the container's right limit ("diff >= - arrowsWidth") and the two last tabs ("diff < (tabWidth * 2)""), then set the tab bar right position to the container's right limit (kudos if you understand this comment)
                        if(diff < (tabWidth * 2) && diff >= - arrowsWidth)
                            go = diff + arrowsWidth;

                        tabsBar.stop().animate({
                            'left': "-=" + go
                        }, 400, function(){
                            toggleArrows();
                        });
                    }
                });

                var toggleArrows = function(){
                    var tabsBarPosLeft = tabsBar.position().left,
                        doClassLeft = (tabsBarPosLeft >= arrowsWidth) ? 'addClass' : 'removeClass',
                        carouselWidth = tabsBarCarousel.outerWidth(),
                        diff = (tabsBarPosLeft + tabsWidth) - carouselWidth,
                        doClassRight = (diff <= -arrowsWidth) ? 'addClass' : 'removeClass';

                    $('.tabbarcarousel-arrow-left')[doClassLeft]('inactive');
                    $('.tabbarcarousel-arrow-right')[doClassRight]('inactive');
                };
                toggleArrows();

                var setUpYearsDropdown = function(){

                    var yearsDropdownMarkup = '<div class="form-group">';
                        yearsDropdownMarkup += '<div class="wrapper-select">';
                        yearsDropdownMarkup += '<select id="years-dropdown" name="years-dropdown" class="form-control">';

                    $('.sliding-tabs-carousel ul.sliding-tabs li').each(function() {

                        var yearName = $(this).children('a').html();

                        yearsDropdownMarkup += '<option value="' + yearName + '"';
                        if($(this).hasClass('active'))
                            yearsDropdownMarkup += 'selected="selected"';
                        yearsDropdownMarkup += '>';
                        yearsDropdownMarkup += yearName;
                        yearsDropdownMarkup += '</option>';
                    });

                    yearsDropdownMarkup += '</select>';
                    yearsDropdownMarkup += '</div>';
                    yearsDropdownMarkup += '</div>';
                    $('.sliding-tabs-carousel').append(yearsDropdownMarkup);

                    $('#years-dropdown').change(function(){
                        $('.sliding-tabs-carousel ul li a[href="#'+ $(this).val() +'"]').tab('show');
                    });
                };
                setUpYearsDropdown();

                var resizeId;
                $(window).resize(function(){
                    clearTimeout(resizeId);
                    resizeId = setTimeout(function(){
                        tabsBar.css('left', 0); // On resize, reset the tab bar position to the left
                        toggleArrows();
                        setArrowsHeight();
                    }, 200);

                    if ($(window).width() >= 768)
                        tabWidth = $('.sliding-tabs-carousel ul li').css('width').replace(/[^-\d\.]/g, '');
                });
            };

            if($('.sliding-tabs-carousel').length)
                setTabBarCarousel();

            /************ End Carousel Sliding Tabs *******************/
            /**********************************************************/

            var setupTabBg = function (tabsBar, slidingTab) {
                if ($(window).width() >= 768) {
                    slidingTab.show();
                    var activeTab = tabsBar.find('li.active'),
                        activeTabLeft = Math.round(activeTab.position().left),
                        activeTabRight = tabsBar.width() - (activeTabLeft + activeTab.width());

                    slidingTab.css({'right': activeTabRight, 'left': activeTabLeft});
                } else {
                    slidingTab.hide();
                }
            };

            var tabsBar = $('.sliding-tabs');
            tabsBar.append('<div class="sliding-tab"></div>');
            var slidingTab = tabsBar.find('.sliding-tab');
            slidingTab.height(tabsBar.find('li a:first-child').outerHeight());

            setupTabBg(tabsBar, slidingTab);

            $(window).resize(function () {
                setupTabBg(tabsBar, slidingTab);
            });

            $('.sliding-tabs a').on('show.bs.tab', function (e) {

                if ($(window).width() >= 768) {
                    var targetTabLeft = Math.round($(e.target).parent().position().left),
                        targetTabRight = tabsBar.width() - (targetTabLeft + $(e.target).outerWidth());

                    slidingTab.animate({
                        left: targetTabLeft,
                        right: targetTabRight
                    }, 300);
                }

                $('#years-dropdown').val(e.target.innerHTML);

            });
        }
    };
    tabsbarTransition();

})(jQuery);

