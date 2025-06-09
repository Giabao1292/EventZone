
import React from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";

const mockEvents = [
    {
        eventId: 1,
        posterImageUrl: "https://tse1.mm.bing.net/th/id/OIP._1mXqh8bcu3Vjl8pxvi7MgHaEK?r=0&w=266&h=266&c=7",
    },
    {
        eventId: 2,
        posterImageUrl: "https://tse4.mm.bing.net/th/id/OIP.69H4QLHs3cK_v4XpNp59jgHaEK?r=0&w=266&h=266&c=7",
    },
    {
        eventId: 3,
        posterImageUrl: "https://tse2.mm.bing.net/th/id/OIP.uIw-QGWQCbGMKRLra5s9tQHaEp?r=0&w=297&h=297&c=7",
    },
    {
        eventId: 4,
        posterImageUrl: "https://tse2.mm.bing.net/th/id/OIP.GDOUPualIAkT5D8YqjZqfAHaHa?r=0&w=474&h=474&c=7",
    },


];

const HeroSlider = () => {
    return (
        <Swiper slidesPerView={1} loop className="w-full max-w-6xl mx-auto my-6 rounded-xl">
            {mockEvents.map((event) => (
                <SwiperSlide key={event.eventId}>
                    <div className="relative">
                        <img
                            src={event.posterImageUrl}
                            className="rounded-xl w-full h-[400px] object-cover"
                        />
                        <div className="absolute bottom-4 left-4">
                            <button className="mt-2 bg-white text-black px-4 py-2 rounded shadow-md">
                                Xem chi tiết
                            </button>
                        </div>
                    </div>
                </SwiperSlide>
            ))}
        </Swiper>
    );
};

export default HeroSlider;
