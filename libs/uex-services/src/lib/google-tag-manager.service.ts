import {Injectable, Renderer2, RendererFactory2} from '@angular/core';

@Injectable()
export class GoogleTagManagerService {
    private isGtmAdded = false;
    private dataLayer: {[key: string]: any}[];
    private renderer: Renderer2;
    constructor(private rendererFactory: RendererFactory2) {
        this.renderer = this.rendererFactory.createRenderer(null, null);
        this.dataLayer = window['dataLayer'] = window['dataLayer'] || [];
    }

    createGTMScript(gtmId: string): void {
        if (this.isGtmAdded) {
            return;
        }
        this.createScript(gtmId);
        this.createNoScript(gtmId);
        this.isGtmAdded = true;
    }

    createScript(gtmId: string): void {
        const script = this.renderer.createElement('script');
        const text = this.renderer.createText(`
        (function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
        new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
        j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
        'https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
        })(window,document,'script','dataLayer','${gtmId}');`);
        this.renderer.appendChild(script, text);
        this.renderer.appendChild(document.head, script);
    }

    createNoScript(gtmId: string): void {
        const noScriptIframe = this.renderer.createElement('iframe');
        this.renderer.setAttribute(noScriptIframe, 'src', `https://www.googletagmanager.com/ns.html?id=${gtmId}`);
        this.renderer.setStyle(noScriptIframe, 'width', 0);
        this.renderer.setStyle(noScriptIframe, 'height', 0);
        this.renderer.setStyle(noScriptIframe, 'display', 'none');
        this.renderer.setStyle(noScriptIframe, 'visibility', 'hidden');
        const noscript = this.renderer.createElement('noscript');
        noscript.appendChild(noScriptIframe);
        this.renderer.insertBefore(document.body, noscript, document.body.firstChild);
    }

    pushToDataLayer(obj: any): void {
        this.dataLayer.push(obj);
    }

    pushEventOnce(event: string, key: string, value: any): void {
        const findEvent = this.dataLayer.filter((data) => data['event'] === event);
        if (findEvent.length === 0 || findEvent[findEvent.length - 1][key] !== value) {
            this.pushToDataLayer({event, [key]: value});
        }
    }

    addPageTag(event: string, product: string, audience: string, contributorCode: string, projectId: string): void {
        this.pushToDataLayer({
            event,
            product,
            audience,
            contributorCode,
            projectId,
        });
    }
}
