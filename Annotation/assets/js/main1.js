function initVSlider()
	{
		if($('.v_slider').length)
		{
			var vSlider = $('.v_slider');

			vSlider.slick(
			{
				infinite: false,
				vertical: true,
				arrows: false,
				draggable: false,
				dots: true,
				responsive:
				[
					{
						breakpoint: 575,
						settings: 
						{
							draggable: true,
							vertical: false,
							dots: false
						}
					}
				]
			});
		}
	}