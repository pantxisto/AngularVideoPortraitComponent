import { Component, Input, OnInit } from '@angular/core';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';

@Component({
  selector: 'app-video',
  templateUrl: './video.component.html',
  styleUrls: ['./video.component.scss'],
})
export class VideoComponent implements OnInit {
  progress: number;
  safeUrl: SafeResourceUrl;
  videoTime: string;
  @Input() set url(value: string) {
    if (!value) return;
    this.safeUrl = this.sanitizer.bypassSecurityTrustResourceUrl(value);
  }
  @Input() contentType: string;
  constructor(private sanitizer: DomSanitizer) {}

  ngOnInit(): void {
    this.progress = 0;
    this.videoTime = '0:00';
  }

  isLandScape(video: HTMLVideoElement) {
    let response = false;
    if (video) response = video.videoWidth > video.videoHeight;
    return response;
  }

  setVideoStyle(video: HTMLVideoElement, videoContainer: HTMLDivElement) {
    let style = {};
    if (!video) return style;
    const landscape = this.isLandScape(video);
    // Todos los videos van a ir en portrait
    // Video horizontal
    if (landscape) {
      // Si el ancho del container  es menor que el alto del
      // video
      // if (videoContainer.offsetWidth <= video.videoHeight) {
      //   style['height'] = videoContainer.offsetWidth + 'px';
      //   style['width'] = 'auto';
      // } else if (videoContainer.offsetWidth > video.videoHeight) {
      //   style['width'] = videoContainer.offsetHeight + 'px';
      //   style['height'] = 'auto';
      // }
      // if (video.videoWidth > videoContainer.offsetHeight) {
        style['width'] = videoContainer.offsetHeight + 'px';
        style['height'] = 'auto';
      // } else {
      //   style['height'] = videoContainer.offsetWidth + 'px';
      //   style['width'] = 'auto';
      // }
    } else {
      // Video vertical
      style['height'] = '100%';
      style['width'] = 'auto';
    }
    return style;
  }

  setControlsStyle(
    video: HTMLVideoElement,
    videoContainer: HTMLDivElement,
    videoControls: HTMLDivElement
  ) {
    let style = {};
    if (!video || !videoContainer) return style;
    const landscape = this.isLandScape(video);
    // Todos los videos van a ir en portrait
    // Video horizontal
    if (landscape) {
      style['width'] = video.offsetHeight + 'px';
      // style['transform'] = `translate(-50%, calc(-50% + ${video.offsetHeight - 20}px))`
    } else {
      // Video vertical
      style['width'] = video.offsetWidth + 'px';
      // style['transform'] = `translate(-50%, calc(-50% + ${video.offsetWidth - 20}px))`
    }
    return style;
  }

  loadedMetadata(event: any) {
    console.log('Loaded metadata');
    console.log(event);
    // Hace que se actualice el DOM
  }

  async onPlay(video: HTMLVideoElement) {
    if (video.paused) {
      try {
        await video.play();
      } catch (error) {
        console.log(error);
      }
    } else {
      video.pause();
    }
  }

  onMute(video: HTMLVideoElement) {
    video.muted = !video.muted;
  }

  onTimeUpdate(video: HTMLVideoElement) {
    if (!isFinite(video.duration)) this.progress = 0;
    else this.progress = (video.currentTime / video.duration) * 100;
    this.generateVideoTime(video.duration, video.currentTime);
  }

  onEnded() {
    this.progress = 0;
  }

  onTemporalPause(video: HTMLVideoElement) {
    video.pause();
  }

  async onTemporalPlay(video: HTMLVideoElement) {
    try {
      await video.play();
    } catch (error) {
      console.log(error);
    }
  }

  onNewProgress(event: any, video: HTMLVideoElement) {
    console.log(event.target.value);
    if (!isFinite(video.duration)) return;
    video.currentTime =
      video.duration * (parseInt(event.target.value, 10) / 100);
    this.generateVideoTime(video.duration, video.currentTime);
  }

  generateVideoTime(duration: number, currentTime: number) {
    let formatedDuration = '0:00';
    let formatedCurrentTime = '0:00';
    if (isFinite(duration)) {
      formatedDuration = this.formateTime(duration);
    }
    if (isFinite(currentTime)) {
      formatedCurrentTime = this.formateTime(currentTime);
    }
    this.videoTime = `${formatedCurrentTime}/${formatedDuration}`;
  }

  formateTime(seconds: number): string {
    let formatedSeconds;
    let formatedMinutes;
    const actualMinutes = Math.floor(seconds / 60);
    const actualSeconds = Math.floor(seconds - actualMinutes * 60);
    if (actualMinutes > 9) formatedMinutes = `${actualMinutes}`;
    else formatedMinutes = `0${actualMinutes}`;
    if (actualSeconds > 9) formatedSeconds = `${actualSeconds}`;
    else formatedSeconds = `0${actualSeconds}`;
    return `${formatedMinutes}:${formatedSeconds}`;
  }
}
