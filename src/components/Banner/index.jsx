import React, {Component} from "react";
import styled from "styled-components";
import movieTrailer from "movie-trailer";
import {playerOptions, TEXT_COLLAPSE_OPTIONS} from "../../utils/hooks";
import YouTube from "react-youtube";
import {Link} from "react-router-dom";
import './style.css'
import {FontAwesomeIcon} from '@fortawesome/react-fontawesome'
import {faExpand, faVolumeHigh, faVolumeXmark,faForwardStep,faBackwardStep,faArrowCircleLeft} from '@fortawesome/free-solid-svg-icons'
import {Fade, Modal} from "react-bootstrap";
import Tab from 'react-bootstrap/Tab';
import Tabs from 'react-bootstrap/Tabs';
import Tooltip from 'react-bootstrap/Tooltip'
import PlayButton from "../../assets/play2.png";
import Backup from "../../assets/backup.png";
import InfoSvg from "../../assets/info.svg";
import Credits from "../Credits";
import VideoList from "../VideosList";
import MovieDetails from "../MovieDetails";
import {Loader} from "../../utils/style/Atoms";
import MovieReviews from "../MovieReviews";
import urls from "../../utils/urls";
import tvUrls from "../../utils/urls/tv";
import RowList from "../RowList";
import MovieProvider from "../Provider";
import imageMyList from "../../assets/list.png";
import imageRemoveMyList from "../../assets/listremove.png";
import {MoviesContext} from "../../utils/context";
import {App} from "@capacitor/app";
import RenderIfVisible from "react-render-if-visible"
import OverlayTrigger from "react-bootstrap/OverlayTrigger";
import MovieReviewsStars from "../MovieReviewsStars";

export const PlayModalMenuButton = styled.button`
    cursor: pointer;
    color: #fff;
    outline: none;
    border: none;
    font-weight: 700;
    border-radius: 0.2vw;
    padding-left: 0.7rem ;
    height:  35px;
    padding-right: 0.5rem;
    margin-right: 0.5rem;
    border-radius: 20px;
    padding-top: 0.3rem;
    padding-bottom: 0.3rem;
    background-color: #c4c4c4;
    width :35px ;  
    margin-left: 6px;
    &:hover{
        color: #000;
        background-color: #e6e6e6;
        transition: all 0.2s;
}
`
export const LoaderWrapper = styled.div`
    display: flex;
    justify-content: center;
`
const MovieHeader = styled.div` 
    width:100%;
    @media  only screen and (max-width:768px ){
        width:initial;
        color: white;
        object-fit: contain;
        height: 448px;
        background-size: cover;   
        background-image: ${({imageUrl}) => 'url(' + imageUrl + ')'},  ${({backup}) => 'url(' + backup + ')'};       
        background-position: center;   
        user-select: none;
        height: 30vh;
        background-position: 30%; 
        background-size:cover;
    }
     @media  only screen and (orientation: landscape){
        color: white;
        object-fit: contain;
        height: 100vh;
        background-size: cover;   
        background-image: ${({imageUrl}) => 'url(' + imageUrl + ')'},  ${({backup}) => 'url(' + backup + ')'};       
        background-position: center;   
        user-select: none;
        background-position: 30%; 
        background-size:cover;
    }   
    
`
const MovieHeaderContent = styled.div`
    margin-left: 30px;
    padding-top: 140px;
    z-index: 10000;
    position:absolute;
    @media  only screen and (max-width:768px ){
        padding-top: 0px;
        margin-left: 0px;
        height:30vh;
    }
`
const MovieTitle = styled.h1`
    font-size: 3rem;
    font-weight: 800;
    padding-bottom: 0.3rem;
    @media  only screen and (max-width:768px ){
        font-size: 1.7rem;
        font-weight: 400;
        padding-top: 0.5rem;
        position:relative;
        width:45vh;
        height:10vh;
        max-width:45vh;
        max-height:20vh;
        margin-top: 4vh;
    }
`
const MovieButton = styled.button`
    cursor: pointer;
    color: #fff;
    outline: none;
    border: none;
    font-weight: 700;
    border-radius: 0.2vw;
    padding-left: 2rem;
    padding-right: 2rem;
    margin-right: 1rem;
    padding-top: 0.5rem;
    padding-bottom: 0.5rem;
    background-color: rgba(51, 51, 51, 0.5);
    width: 15vh;
    @media  only screen and (max-width:768px ){
        margin-top:1vh;
        margin-left:1vh;
        width: 20vh;
        height:5vh;        
    }    
    &:hover{
        color: #000;
        background-color: #e6e6e6;
        transition: all 0.2s;
    }
`
const Recommended = styled.div`
    width: 18vh;
    color: lightgreen;
    font-weight: 800;
    @media  only screen and (max-width:768px ){
      font-weight: 500;
      text-align: left;
      width: 23vh;
    }     
`
const RecommendedLine = styled.div`
    width: 100%;
    display: flex; 
    margin-left: 20px;
    @media  only screen and (max-width:768px ){
       margin-top:6vh;
    }
`

const DescriptionContainer = styled.div`
    width: 100%;
    display: flex;
    flex-direction: row;
    justify-content: center;
    @media  only screen and (max-width:768px ){
        display:block;
    }      
`
const MovieFadeBottom = styled.div`
    height: 7.4rem;
    background-image: linear-gradient(
        180deg,
        transparent,
        rgba(37, 37, 37, 0.61),
        #111  
    );
    width: 100%;
    position: ${({isMainMenu}) =>  isMainMenu   ? 'relative' : 'absolute'}; 
    bottom: ${({isMainMenu}) =>  isMainMenu   ? '2.5vh' : '-0.5vh'};  
    z-index: 1000;
    @media  only screen and (max-width:768px ){
        display : none ;
    }
    @media  only screen and (orientation: landscape){
        display : none ;
    }  
`


const LoaderContainer = styled.div`
    width: 100%;
    object-fit: contain;
    position: absolute ;
    top :0;
    z-index:100;
`
const VideoContainer = styled.div`
    opacity : ${({isVideoLoading,isVideoError,isVideoPlaying}) =>  isVideoLoading || isVideoError || !isVideoPlaying ? '0' : '1'};
    background-color: black;
    :fullscreen {
      position: fixed;
      top: 0;
    }
`
const SoundContainer = styled.div`
    position:absolute;
    cursor:pointer;
    right:1vh;
    z-index:1000;
    top:0;
    @media only screen and (max-width:768px ){
        position: fixed;
    }
`
const Expand = styled.div`
    position:absolute;
    right:1vh;
    z-index:1100;
    top: 40vh;
    cursor:pointer;
    @media only screen and (max-width:768px ){
        position: fixed;
        z-index: 2000;
        right: 1vh;
        top: 25vh;
    }
`
const Details = styled.div`
    display:none; 
     @media  only screen and (max-width:768px ){
        display:block;
        position: fixed;
        z-index: 2000;
        left:0vh;
        top: 25vh; 
    } 
`

class Banner extends Component {
    static contextType = MoviesContext;
    constructor(props) {
        super(props)
        this.state = {
            trailerURL: "",
            currentTrailerUrl:"",
            isVideoLoading: false,
            isVideoPlaying: false,
            showPlayButton:false,
            vidError: false,
            startVideo: false,
            playerObj : {},
            sound:false,
            showModal:false,
            focus : this.props.focus,
            first : true,
            key : 1,
            isMainMenu : this.props.isMainMenu,
            showType : this.props.showType,
            prevShowModal: false,
        }

    playerOptions.height = window.screen.height-(window.screen.height*0.35);
    TEXT_COLLAPSE_OPTIONS.minHeight = 150;
    TEXT_COLLAPSE_OPTIONS.maxHeight = 250;
    }

    addOneItem(id) {
        const cartFilteredCurrentMovie = this.props.myList.filter((item) => item.id !== id)
        const result = [...cartFilteredCurrentMovie]
        result.unshift(
            {
                id: id,
                title: this.props.title,
                backdrop_path: this.props.imageUrl,
                poster_path: this.props.imageUrlPoster,
                overview: this.props.overview,
                genres: this.props.genres,
                popularity: this.props.popularity,
                release_date: this.props.year,
                adults: this.props.adults,
                showType : this.props.showType,
                imdbId:""
            })
        this.props.updateMyList(result)
    }

    removeOneItem(id) {
        const cartFilteredCurrentMovie = this.props.myList.filter((item) => item.id !== id)
        let result = [...cartFilteredCurrentMovie]
        this.props.updateMyList(result)
    }

    setImdbId(id){
        this.setState({imdbId: id})
    }
    updateImdbId = (id) =>{
        this.setImdbId( id)
    }

    setMainMenu(flag){
        this.setState({isMainMenu: flag})
    }

    updateMenuStatue = (flag) =>{
        this.setMainMenu( flag)
    }

    setFirst(flag){
        this.setState({first: flag})
    }

    setTrailerURL(title) {
        this.setState({trailerURL: title})
    }

    setCurrentTrailerURL(id){
        this.setState({currentTrailerUrl: id})
    }

    setIsVideoLoading(flag) {
        this.setState({isVideoLoading: flag})
    }

    setPlayButton(flag) {
        this.setState({showPlayButton: flag})
    }

    setVidError(flag) {
        this.setState({vidError: flag})
    }

    setStartVideo(flag) {
        this.setState({startVideo: flag})
    }

    setIsVideoPlaying(flag) {
        this.setState({isVideoPlaying: flag})
    }

    setPlayerObj(obj) {
        this.setState({playerObj: obj})
    }

    setShowModal(flag) {
        this.setState({showModal: flag})
    }

    truncate = (str, n) => {
        return str?.length > n ? str.substr(0, n - 1) + "..." : str;
    }


    componentDidMount() {
        if (!this.props.isMainMenu) {
            this.handleClick(this.props.id)
        }
        this.setShowModal(false)
        this.context.setModalVisibility(false)
    }

    componentWillReceiveProps(nextProps, nextState) {
        if (nextProps.title !==  this.props.title) {
            playerOptions.playerVars.mute = !this.state.sound ? 1 : 0;
            this.handleClick(nextProps.id)
            this.setState({key: 1})
        }
        this.setPlayButton(false);
    }


    componentDidUpdate(prevProps, prevState) {
        // Handle modal visibility changes
        if (this.context.showModal !== prevState.prevShowModal) {
            this.setState({ prevShowModal: this.context.showModal });
            this.setShowModal(this.context.showModal);
        }

        // Handle item changes
        if (prevProps.id !== this.props.id) {
            this.cleanupVideoPlayer(); // Clean up previous video state
            this.handleClick(this.props.id);
        }

        // Handle title changes
        if (prevProps.title !== this.props.title) {
            playerOptions.playerVars.mute = !this.state.sound ? 1 : 0;
            this.cleanupVideoPlayer(); // Clean up previous video state
            this.handleClick(this.props.id);
            this.setState({ key: 1 });
        }
    }

    cleanupVideoPlayer = () => {
        if (this.state.playerObj && typeof this.state.playerObj.stopVideo === 'function') {
            try {
                this.state.playerObj.stopVideo();
            } catch (err) {
                console.error("Error stopping video:", err);
            }
        }
        this.setTrailerURL("");
        this.setCurrentTrailerURL("");
        this.setIsVideoPlaying(false);
        this.setPlayButton(false);
        this.setIsVideoLoading(false);
    }

    componentWillUnmount() {
        this.cleanupVideoPlayer();
    }

    handleClick = async (id) => {
        this.setVidError(false);
        this.setIsVideoLoading(true);

        try {
            // Try with specified language first
            let url = await movieTrailer(null, {
                tmdbId: id,
                language: this.props.language,
                videoType: this.props.showType
            });

            if (!url) {
                // Try without language specification
                url = await movieTrailer(null, {
                    tmdbId: id,
                    videoType: this.props.showType
                });
            }

            if (!url) {
                throw new Error('No trailer found');
            }

            const urlParams = new URLSearchParams(new URL(url).search);
            const videoId = urlParams.get("v");

            if (!videoId) {
                throw new Error('Invalid video ID');
            }

            const playerPresent = this.state.playerObj &&
                typeof this.state.playerObj.loadVideoById === "function";

            if (playerPresent) {
                this.state.playerObj.loadVideoById(videoId);
            } else {
                this.setTrailerURL(videoId);
            }

            this.setCurrentTrailerURL(videoId);
            this.setVidError(false);

        } catch (error) {
            console.error("Error loading trailer:", error);
            this.cleanupVideoPlayer();
            this.setVidError(true);
        } finally {
            this.setIsVideoLoading(false);
        }
    };

    updateTrailer = (key) => {
        if (key !== this.state.currentTrailerUrl) {
            this.cleanupVideoPlayer();
            playerOptions.playerVars.mute = !this.state.sound ? 1 : 0;

            if (this.state.playerObj?.loadVideoById) {
                try {
                    this.state.playerObj.loadVideoById(key);
                    this.setCurrentTrailerURL(key);
                    this.setVidError(false);
                } catch (error) {
                    console.error("Error updating trailer:", error);
                    this.setVidError(true);
                }
            }
        }
    }

    enableSound = () => {
        if(this.state.playerObj.isMuted()){
            this.state.playerObj.unMute()
            this.state.playerObj.setVolume(50)
            this.setState({sound: true})
        }else{
            this.state.playerObj.mute();
            this.setState({sound: false})
        }
    }

    enableFullScreen = () => {
        const playerElement = document.getElementById('vidPlayer')
        const requestFullScreen = playerElement.requestFullScreen || playerElement.mozRequestFullScreen || playerElement.webkitRequestFullScreen ;
        if (requestFullScreen) {
            //android
            window.screen.orientation.lock('landscape')
            requestFullScreen.bind(playerElement)()
            //wpa
            // requestFullScreen.bind(playerElement)()
            // window.screen.orientation.lock('landscape')
        }
    }


    enablePause=()=>{
        if(this.state.playerObj.getPlayerState()!==1){
            this.state.playerObj.playVideo();
        } else {
            this.state.playerObj.pauseVideo();
        }
    }

    getTooltip = (message)=> {
        return <Tooltip id="tooltip">{message}</Tooltip>;
    }

    handleSelect = (key) =>{
        this.setState({key: key})
    }

    render(){
        const {imageUrl,imageUrlPoster,title,adults,popularity,year,isMainMenu,id,language,character,showSimilar, showType} = this.props;
        return (
            <MovieHeader imageUrl={imageUrl} backup={Backup}>
                <MovieHeaderContent id='header' isMainMenu={isMainMenu} >
                    {this.state.showPlayButton?
                        <div style={{textAlign: 'center', position: 'absolute', top: '13vh', left: '22vh'}}>
                            <PlayModalMenuButton onClick={this.enablePause}><img alt='' src={PlayButton}/></PlayModalMenuButton>
                        </div>
                        : ''
                    }
                    {this.state.isVideoPlaying?
                        <div>
                            <SoundContainer onClick={this.enableSound}>
                                {this.state.sound ?
                                    <FontAwesomeIcon icon={faVolumeHigh}/>
                                    :
                                    <FontAwesomeIcon icon={faVolumeXmark}/>
                                }
                            </SoundContainer>
                            <Expand onClick={this.enableFullScreen}>
                                <FontAwesomeIcon icon={faExpand}/>
                            </Expand>
                        </div>
                        :''}
                    <Details id='myModal' title='more details' onClick={e => {this.setState({showModal: true});}} >
                        <img style={{width:'3.5vh'}} alt='' src={InfoSvg}/>
                    </Details>
                    {!this.state.isVideoPlaying || !this.state.showModal ?
                        <MovieTitle onClick={this.enablePause}> {title}</MovieTitle>
                        : <MovieTitle onClick={this.enablePause} />
                    }

                    <DescriptionContainer >
                        {!this.state.isVideoPlaying || !this.state.showModal ?
                            <div style={{width: '70vh', height: '5vh'}}>
                                {!showSimilar ?
                                    <Link to={`/`}>
                                        <MovieButton><FontAwesomeIcon icon={faArrowCircleLeft}/></MovieButton>
                                    </Link>:''}
                            </div>
                            :
                            <div style={{width: '70vh', height: '5vh'}}>
                            </div>}
                        <RecommendedLine style={{width: '100%', display: 'flex', textAlign: 'center',marginLeft:'5vh'}}>
                            <Recommended>Recommand at {popularity}%</Recommended>
                            <div> for : {adults ? ' Adults  ' : 'All family'}</div>
                            <div style={{border: 'solid 1px', height: 'fit-content', marginLeft: '5px'}}> {year}</div>
                        </RecommendedLine>
                    </DescriptionContainer>

                </MovieHeaderContent>
                <LoaderContainer >
                    {this.state.vidError ? <span style={{color:'white'}}>no trailer...</span>:''}
                    {(this.state.isVideoLoading && !this.state.vidError )?
                        <LoaderWrapper data-testid='loader'>
                            <Loader style={{marginTop:'0vh'}} id='myloader'/>
                        </LoaderWrapper>
                        :''}
                    <VideoContainer isVideoLoading={this.state.isVideoLoading} isVideoPlaying={this.state.isVideoPlaying} isVideoError={this.state.vidError}>
                        <YouTube key='testVideo' id='vidPlayer' className='video-background-banner'
                                 onPlay={e => {
                                     this.setIsVideoLoading(false);
                                     this.setIsVideoPlaying(true);
                                     this.setFirst(false);
                                     this.setVidError(false);
                                     App.addListener('appStateChange', (state) => {
                                         if (state.isActive) {
                                             this.state.playerObj.playVideo();
                                         } else {
                                             this.state.playerObj.pauseVideo();
                                         }
                                     });
                                 }}
                                 onError={e => {this.setVidError(true);this.setIsVideoPlaying(false);this.setIsVideoLoading(false);}}
                                 onReady={e=>{
                                     e.target.playVideo();
                                     this.setPlayerObj(e.target);
                                     this.setIsVideoPlaying(false);
                                     this.setIsVideoLoading(true);
                                     this.setVidError(false);
                                 }}
                                 onStateChange={e=> {
                                     const t =  [-1,0,3,5]
                                     if(!t.includes(e.target.getPlayerState())  && !this.state.isVideoLoading){
                                         if(e.target.getPlayerState() ===2)this.setPlayButton(true)
                                         if(e.target.getPlayerState() ===1)this.setPlayButton(false)
                                     }else{
                                         this.setPlayButton(false)
                                     }
                                 }
                                 }
                                 onEnd={ e=> {this.setVidError(false);this.setIsVideoPlaying(false);this.setIsVideoLoading(false);}}
                                 videoId={this.state.trailerURL}
                                 opts={playerOptions}
                        />
                    </VideoContainer>
                </LoaderContainer>
                <MovieFadeBottom />
                <Modal id="mymodal" key={`--CardModal'`} show={this.state.showModal} className={`my-modal ${this.state.showModal ? 'bounce-in' : ''}`} style={{top:'30vh', WebkitUserSelect: 'none',backgroundColor:'#594757'}} >
                    <Modal.Dialog style={{backgroundPosition:'top', backgroundSize: 'cover',backgroundImage: `url(${imageUrlPoster})`}}>
                        <Modal.Header onClick={() => {
                            this.setState({showModal: false});
                            if(!this.props.showSimilar)
                                this.setState({isMainMenu: true})
                        }} style={{border: 'transparent',height:'9vh'}}  >
                            <Modal.Title><h1 style={{ lineHeight: '0.8'}}>{title} </h1></Modal.Title>
                            <button type="button" style={{border: 'transparent',backgroundColor: 'transparent',color: 'white'}} aria-label="Close">
                                <span>&times;</span>
                            </button>
                        </Modal.Header>
                        <Modal.Body className="container" style={{overflowX: 'hidden', overflowY: 'auto'}}>
                            {
                                this.props?.myList.map(e=>e.id).includes(id) ?
                                    <OverlayTrigger delay={{ "show": 250, "hide": 100 }} placement="left" overlay={this.getTooltip("added to my list")} >
                                        <img alt={`add${id}`} style={{height: '4vh',width: '4vh',float: 'right'}} onClick={e=>{this.removeOneItem(id);}} src={imageRemoveMyList} />
                                    </OverlayTrigger>
                                    :
                                    <OverlayTrigger delay={{ "show": 250, "hide": 100 }}  placement="left" overlay={this.getTooltip("removed to my list")} >
                                        <img alt={`rem${id}`} style={{height: '4vh',width: '4vh',float: 'right'}} onClick={e=>this.addOneItem(id)} src={imageMyList} />
                                    </OverlayTrigger>
                            }
                            <RenderIfVisible>
                                <Tabs
                                    className="mb-3"
                                    transition={Fade}
                                    activeKey={this.state.key }
                                    onSelect={this.handleSelect}
                                    // fill  justify
                                >
                                    <Tab eventKey={1} title="Movie" >
                                        {character ? character : ''}
                                        <MovieReviewsStars title={title} imdbId={this.state.imdbId} />
                                        <MovieDetails showType={showType} id={id} language={language} updateImdbId={this.updateImdbId}/>
                                        <VideoList showType={showType} id={id} language={language} setTrailerURL={this.updateTrailer} isVideoPlaying={this.state.isVideoPlaying} trailerURL={this.state.currentTrailerUrl} updateMenuStatue={this.updateMenuStatue} />
                                        <Credits showType={showType} id={id} language={language}/>
                                        <MovieProvider showType={showType}  id={id} language={language.length > 2 ? language?.split("-")[1] : language.toUpperCase()}/>
                                        <MovieReviews showType={showType} title={title} language={language} id={id} />
                                    </Tab>
                                    {this.props.showSimilar ?
                                        <Tab eventKey={4} title="Similar">
                                            <RowList sort={true} confirm={true} style={{position: 'relative'}}
                                                     title={showType && showType === "tv" ?'Similar Tv show':'Similar movie'}
                                                     url={showType && showType === "tv" ?
                                                         tvUrls.findRecommendedById.replace("{id}", id).replace('original', 'w185') + language :
                                                         urls.findRecommendedById.replace("{id}", id).replace('original', 'w185') + language}
                                                     isLargeRow={true}/>
                                            <RowList sort={true}  confirm={true}  style={{position: 'relative'}}
                                                     title={showType && showType === "tv" ?'Recommended Tv show':'Recommended Movie'}
                                                     url={showType && showType === "tv" ?
                                                         tvUrls.findSimilarById.replace("{id}", id).replace('original','w185') + language:
                                                         urls.findSimilarById.replace("{id}", id).replace('original','w185') + language}
                                                     isLargeRow={true}/>
                                        </Tab> : ''}

                                </Tabs>
                            </RenderIfVisible>
                        </Modal.Body>
                        <Modal.Footer style={{border: 'transparent',display: 'initial'}}>
                            <div className="d-flex justify-content-between" >
                                {this.context.moviesContext[this.context.currentIndex - 1] ?
                                    <div onClick={() => {
                                        document.querySelector(".modal-body").scrollTo({top: 0})
                                        this.context.saveCurrentIndex(this.context.currentIndex - 1)
                                        this.context.saveMovie(this.context.moviesContext[this.context.currentIndex - 1])
                                    }}>
                                        <FontAwesomeIcon size="xl"
                                                         style={{color: 'white', paddingLeft: '0px !important'}}
                                                         icon={faBackwardStep}/>
                                    </div>
                                    : <div>
                                        <FontAwesomeIcon size="xl"
                                                         style={{color: 'transparent', paddingLeft: '0px !important'}}
                                                         icon={faBackwardStep}/>
                                    </div>
                                }
                                <div>
                                    <Link
                                        to={`/movieDetails/${this.state.currentTrailerUrl !== "" ? this.state.currentTrailerUrl : undefined}/${this.state.sound}/${this.state.imdbId}/${language}/${showType}`}>
                                        <PlayModalMenuButton><img alt='' src={PlayButton}/></PlayModalMenuButton>
                                    </Link>
                                </div>

                                {this.context.moviesContext[this.context.currentIndex + 1] ?
                                    <div onClick={() => {
                                        document.querySelector(".modal-body").scrollTo({top: 0})
                                        this.context.saveCurrentIndex(this.context.currentIndex + 1)
                                        this.context.saveMovie(this.context.moviesContext[this.context.currentIndex + 1])
                                    }}>
                                        <FontAwesomeIcon size="xl"
                                                         style={{color: 'white', paddingLeft: '0px !important'}}
                                                         icon={faForwardStep}/>
                                    </div>
                                    :
                                    <div>
                                        <FontAwesomeIcon size="xl"
                                                         style={{color: 'transparent', paddingLeft: '0px !important'}}
                                                         icon={faForwardStep}/>
                                    </div>
                                }
                            </div>
                        </Modal.Footer>
                    </Modal.Dialog>
                </Modal>
            </MovieHeader>

        )
    }
}
export default  Banner