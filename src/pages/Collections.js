import axios from 'axios'
import React, { useEffect, useState } from 'react'
import { Container } from 'react-bootstrap'
import { AiFillHeart } from 'react-icons/ai'
import { BsFillMicFill } from 'react-icons/bs'
import { SiImdb } from 'react-icons/si'
import LazyLoad from 'react-lazyload'
import { useParams } from 'react-router'
import { Link } from 'react-router-dom'
import { Swiper, SwiperSlide } from "swiper/react";
import Preview from '../components/movie/Preview'
import { imageUrl } from '../utils/functions'
import './Collections.scss'

const Collections = () => {
    const [data, setData] = useState({})
    const [items, setItems] = useState([])
    const [itemData, setItemData] = useState({})
    const [previewState, setPreviewState] = useState({
        id: undefined,
        active: false
    })
    let {id} = useParams()

    const togglePreview = id => {
        setPreviewState(prevState => {
            let newState = {...prevState};
            if(id !== prevState.id) {
                newState.id = id;
                newState.active = true;
            } else {
                newState.active = !prevState.active
            }
            return newState
        })
    }

    useEffect(() => {
        axios.get(`https://www.namava.ir/api/v1.0/post-groups/${id.split('-')[0]}`)
        .then(response => {
            setData(response.data.result)
        })

        axios.get(`https://www.namava.ir/api/v1.0/post-groups/${id.split('-')[0]}/medias?pi=1&ps=20`)
        .then(response => {
            setItems(response.data.result)
        })
    }, [id])

    const getItemDataHandler = (id) => {
        axios.get(`https://www.namava.ir/api/v1.0/medias/${id}/brief-preview`)
        .then(response => {
            setItemData(response.data.result)
        })
        .catch(err => console.log(err))
    }

    return (
        <Container fluid className='p-0'>
            <div className='collection-container'>
                <div className='collection-header'>
                    <img src={imageUrl(data?.coverLandscape)} />
                    <h1>{data?.caption}</h1>
                    <p dangerouslySetInnerHTML={{__html: data?.shortDescription}}></p>
                </div>

                <div className='px-5'>
                <Swiper
                    slidesPerView={7.2}
                    spaceBetween={15}
                    pagination={{clickable: true }}
                    dir="rtl"
                    className="moviesList"
                >
                    {items?.length > 0 && 
                        items.map(item => (
                            <SwiperSlide 
                                onClick={() => togglePreview(item.id || item.seriesId)} 
                                key={item.id || item.episodId} 
                                onMouseEnter={() => getItemDataHandler(item.id || item.episodeId)}
                                className={(item.episodId || item.id) === previewState.id && previewState.active && 'activeMovie'}
                            >
                                <LazyLoad className="image-placeholder" >
                                    <img src={imageUrl(item.imageUrl || item.seriesImageUrl)} />
                                    <div className='brief-data'>
                                        <div>
                                            <h6>{item.type === "Series" ? 'سریال' : 'فیلم'} </h6> {' - '} 
                                            <h6> {itemData.year}</h6>
                                        </div>
                                        {itemData.hit > 0 && <h6><AiFillHeart /> {itemData.hit}% </h6>}
                                        {itemData.imdb && <h6><SiImdb /> {itemData.imdb} </h6>}
                                        {itemData.hasPersianSubtitle && <h6><BsFillMicFill /> دوبله نماوا </h6>}
                                    </div>
                                </LazyLoad>
                                <h6>{item.caption || item.seriesCaption }</h6>
                                <span>{item.episodCaption?.split('-')[1]}</span>
                            </SwiperSlide>
                        ))
                    }
                </Swiper>
            </div>
            {<Preview id={previewState.id} isActive={previewState.active} />}
        </div>
        </Container>
    )
}

export default Collections
