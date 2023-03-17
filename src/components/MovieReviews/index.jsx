import urls from "../../utils/urls";
import {TEXT_COLLAPSE_OPTIONS, useFetch, useFetchListWithFallBack} from "../../utils/hooks";
import {Loader} from "../../utils/style/Atoms";
import React from "react";
import {LoaderWrapper} from "../RowBanner";
import ReactTextCollapse from "react-text-collapse"
import StarRating from "../StarRating";
import imdbImage from "../../assets/imdb.png";
import rotten from "../../assets/rotten.svg";
import metaCritic from "../../assets/metacritic.png";


function MovieReviews({id, language,imdbId}) {
    const {isLoading, data,error} = useFetchListWithFallBack(urls.findReviewsById.replace('{id}', id) + language.split("").slice(0,2).join(""), urls.findReviewsById.replace('{id}', id).replace("&language=", ""))
    const [isLoadingOmdbapi, dataOmdbapi, errorOmdbapi] = useFetch(urls.findReviewByImbId.replace('{tmdb_id}',imdbId), false)
    return (
        <div>
            <div>
                {isLoadingOmdbapi ? (
                    <LoaderWrapper data-testid='loader'>
                        <Loader style={{marginTop: '0vh'}}/>
                    </LoaderWrapper>
                ) :
                    <div style={{lineHeight: '1.4rem',display:'flex',justifyContent: "space-around"}}>
                        {dataOmdbapi && dataOmdbapi?.Ratings?.length > 0 && dataOmdbapi?.Ratings?.map((source, index) =>
                            <div key={index + '_container'} style={{display: "inline-block", marginTop: '2vh'}}>
                                {source['Source'] === "Internet Movie Database" ?
                                    <div>
                                        <a href={`https://m.imdb.com/title/${imdbId}`} target="_blank">
                                            <img style={{height: '4vh',width: '4vh'}}  src={imdbImage} />
                                        </a>
                                        <StarRating value={Math.floor(Number(source['Value'].split("/")[0]) / 2)}/>
                                    </div>
                                    : ""}
                                {source['Source'] === "Metacritic" ?
                                    <div>
                                        <a href={`https://www.metacritic.com/movie/${dataOmdbapi["Title"]?.replaceAll(" ", "-").replaceAll(":", "").replaceAll(".", "").replaceAll("'", "").toLowerCase()}`} target="_blank">
                                            <img style={{height: '4vh',width: '4vh'}}  src={metaCritic} />
                                        </a>
                                        <StarRating value={Math.floor(Number(source['Value'].split("/")[0]) / 20)}/>
                                    </div>
                                    : ""}

                                {source['Source'] === "Rotten Tomatoes" ?
                                    <div>
                                        <a href={`https://www.rottentomatoes.com/m/${dataOmdbapi["Title"]?.replaceAll(" ", "_").replaceAll(":", "").replaceAll(".", "").replaceAll("'", "").toLowerCase()}`} target="_blank">
                                            <img style={{height: '4vh',width: '4vh'}}  src={rotten} />
                                        </a>
                                        <StarRating value={Math.floor(Number(source['Value'].replace("%", "") / 20))}/>
                                    </div>
                                    : ""}
                            </div>
                        )}
                    </div>
                }

            </div>


            <div>
                {error ? <span style={{color: 'white'}}>Oups something went wrong</span> : ''}
                {data?.length === 0 ? ' no reviews...' : ''}
                {isLoading ? (
                    <LoaderWrapper data-testid='loader'>
                        <Loader style={{marginTop: '0vh'}}/>
                    </LoaderWrapper>
                ) : ''}
                <div style={{lineHeight: '1.4rem'}}>
                    {data && data?.length > 0 && data?.map((review, index) =>
                        <div key={index + '_container'} style={{display: "inline-block", marginTop: '2vh'}}>
                            <div>
                                <span style={{color: 'gray'}}>author</span> : <span>{review?.author}</span>
                            </div>
                            {review.content.length > 200 ?
                                <ReactTextCollapse options={TEXT_COLLAPSE_OPTIONS}>
                                    <div style={{
                                        color: 'beige',
                                        textTransform: 'inherit',
                                        fontStyle: 'italic',
                                        position: 'relative'
                                    }}
                                         dangerouslySetInnerHTML={{__html: review.content}}/>
                                </ReactTextCollapse> :
                                <div style={{
                                    color: 'beige',
                                    textTransform: 'inherit',
                                    fontStyle: 'italic',
                                    position: 'relative'
                                }}
                                     dangerouslySetInnerHTML={{__html: review.content}}/>
                            }
                        </div>
                    )
                    }
                </div>
            </div>
        </div>
    )
}

export default MovieReviews;