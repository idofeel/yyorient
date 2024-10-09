
//  Import Swiper React components
// swiper【Autoplay:自动播放 ,Pagination:分页 ,Navigation:标记页数】
import SwiperCore, {Autoplay,Pagination,Navigation} from 'swiper/core';


import { Swiper, SwiperSlide } from 'swiper/react';

// Import Swiper styles
import 'swiper/swiper.min.css';
import 'swiper/swiper-bundle.min.css';


SwiperCore.use([Autoplay,Pagination,Navigation])

export default () => {
	const list = [
		{src:require('@/assets/banner/banner1.jpg'), alt:'', title:'', },
		{src:require('@/assets/banner/banner2.jpg'), alt:'', title:'', },
		{src:require('@/assets/banner/banner3.jpg'), alt:'', title:'', },
		{src:require('@/assets/banner/banner4.jpg'), alt:'', title:'', },
		{src:require('@/assets/banner/banner5.jpg'), alt:'', title:'', },
		{src:require('@/assets/banner/banner6.jpg'), alt:'', title:'', },
		{src:require('@/assets/banner/banner7.jpg'), alt:'', title:'', },
		{src:require('@/assets/banner/banner8.jpg'), alt:'', title:'', },
	]
  return (
	<div style={{margin: '20px 0'}}>
		<Swiper
		slidesPerView={1}
		spaceBetween={30}
		autoHeight={true}
		loop={true}
		autoplay={ 	{
			delay: 3000,
			disableOnInteraction: false,
		}
		}
		pagination={{ clickable: true }}
		navigation={true}
		modules={[Autoplay,Pagination, Navigation]}
		className="mySwiper"
		onSlideChange={() => console.log('slide change')}
		onSwiper={(swiper) => console.log(swiper)}
		>
			{list.map((item, index)=>(
				<SwiperSlide key={index}>
					<img src={item.src} alt={item.alt} style={{maxWidth: '100%', padding: '0 20px'}}/>
				</SwiperSlide>
			))}
		</Swiper>

	</div>

  );
};