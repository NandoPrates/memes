var $ = require('wetfish-basic');
var storage = require('../app/storage');

var animate =
{
    active: false,
    element: false,
    object: false,

    init: function()
    {
        // Save the default element notification text
        animate.defaultText = $('.menu .animate .element').el[0].textContent;

        $('body').on('click', '.workspace .content, .workspace .content *', function()
        {
            var element = this;

            // If we clicked on a child element
            if(!$(element).hasClass('content'))
            {
                // Find the parent content element
                element = $(this).parents('.content').el[0];
            }

            if(animate.active)
            {
                animate.element = element;
                animate.populate();
                animate.menu();
            }
        });

        $('.animate .new').on('click', function()
        {
             var name = prompt("Please enter a memorable name for this animation.");

             if(animate.object.animation !== undefined && animate.object.animation[name] !== undefined)
             {
                var replace = confirm("An animation named '" + name + "' already exists. Are you sure you want to overwrite it?");

                if(!replace)
                {
                    return;
                }
             }

            animate.name = name;
            storage.animation.save(animate.element, animate.name, []);
            animate.populate();
        });

        $('.animate .animations select').on('change', function(event)
        {
            var animation = $(this).value();

            // Only trigger when an actual animation is selected
            if(animation)
            {
                $('.animation-selected').removeClass('hidden');
                animate.name = animation;
            }
            else
            {
                $('.animation-selected').addClass('hidden');
            }
        });

        $('.animate .delete').on('click', function()
        {
            storage.animation.delete(animate.element, animate.name);
            animate.populate();
        });
    },

    // Populate data from saved object
    populate: function()
    {
        var id = $(animate.element).attr('id');
        var object = storage.getObject(id);

        animate.object = object;

        var  desc = object.desc || 'untitled ' + object.type;
        $('.menu .animate .element').text(desc);

        if(object.animation !== undefined && Object.keys(object.animation).length)
        {
            // Remove any previously created animations
            $('.animate .animations .custom').remove();
            $('.animate .animations').removeClass('hidden');

            // Loop through saved animatinos and populate the dropdown
            Object.keys(object.animation).forEach(function(name)
            {
                var option = document.createElement('option');
                $(option).addClass('custom');
                $(option).text(name);
                $('.animate .animations select').append(option).trigger('change');
            });
        }
        else
        {
            $('.animate .animations').addClass('hidden');
        }
    },

    // Display menu options based on the current animation state
    menu: function()
    {
        if(animate.element)
        {
            $('.element-selected').removeClass('hidden');
        }
        else
        {
            $('.element-selected').addClass('hidden');
        }
    },

    start: function()
    {
        $('.workspace').addClass('highlight-content');
        animate.active = true;
    },

    stop: function()
    {
        $('.workspace').removeClass('highlight-content');
        animate.active = false;
        animate.element = false;
        animate.object = false;

        $('.menu .animate .element').text(animate.defaultText);
    }
};

module.exports = animate;
