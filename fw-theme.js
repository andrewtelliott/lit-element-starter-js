/**
 * @license
 * Copyright 2019 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */

import {LitElement, html, css} from 'lit';
import Color from 'colorjs.io';

/**
 * An example element.
 *
 * @fires color-changed - Indicates when the color changes
 * @slot - This element has a slot
 */
export class FwTheme extends LitElement {
  static get styles() {
    return css`
    `;
  }

  static properties = {color: {type: String}, fwThemeClass: {type: String}};

  constructor() {
    
    super();
    this.lightSchemeBase=["#fcfcfc","#f9f9f9","#f0f0f0","#e8e8e8","#e0e0e0","#d9d9d9","#cecece","#bbbbbb","#8d8d8d","#838383","#646464","#202020" ];
    this.color = this.getAttribute('fw-theme-color');
    this.themeClass = this.getAttribute('fw-theme-class');
    this.classList.add("c-"+this.themeClass);
    var colorSpace = 'hsl';
    var minContrast = 70;
    var contrastAlgo = "APCA";
    this.colors = {};
    // this.complement = new Color(this.color)
    //   .to(colorSpace)
    //   .set('h', (new Color(this.color).h + 180) % 360)
    //   .to(colorSpace);

    //Style Layer

    this.makeColor = function (color) {
      var colors = [];
      var scalarFunction = function(seed,type){
        // 0,1,2,3 should return 90-100
        // 4,5,6,7 should return 40-60
        // 8,9,10,11 should return 90-100

        var hslScale = [
          {l: 99.5, s: 100},
          {l: 98, s: 100},
          {l: 97, s: 95},
          {l: 95, s: 90},
          {l: 93, s: 85},
          {l: 90, s: 80},
          {l: 80, s: 75},
          {l: 50, s: 50},
          {l: 34, s: 65},
          {l: 30, s: 75},
          {l: 25, s: 85},
          {l: 15, s: 100},
        ];
        return (hslScale[seed][type]);
      }
      for ( let count in this.lightSchemeBase ){
        colors['l-' + count] = new Color(this.lightSchemeBase[count]).mix(this.color,(scalarFunction(count,"l")/100) )
          .to(colorSpace);
          colors['l-' + count].s=scalarFunction(count,"s");
          colors['l-' + count].l=scalarFunction(count,"l");
      }

      // check contrast - ensure over 70
      Object.keys(colors).forEach(function (color, index) {
        // while( Math.abs(colors[color].contrast(colors['l-0'],"APCA")) < 70 &&Math.abs(colors[color].contrast(colors['l-11'],"APCA")) < 70 ){

        //   console.log("contrast: " + Math.abs(colors[color].contrast(colors['l-0'], "APCA")) + " / " + Math.abs(colors[color].contrast(colors['l-11'],"APCA")));

        // }

      })
      return colors;
    };

    this.colors[this.themeClass] = this.makeColor(this.color);
    // this.colors.primary = this.makeColor('blue');
    // this.colors.complement = this.makeColor(this.complement);

    this.outputSpectrum = function (spectrum) {
      let outDiv = document.createElement('div');
      var output = ``;
      Object.keys(spectrum).forEach(function (color) {
        Object.keys(spectrum[color]).forEach(function (tone) {

          var borderStep=parseInt(tone.split('-')[1]),
            textStep=11;
            borderStep = (borderStep > 7) ? (borderStep - 4) : (borderStep + 4);
          var colorText = new Color(spectrum[color][`l-${textStep}`]);
          var contrast = (new Color(spectrum[color][tone]).contrast(colorText, "APCA")).toFixed(2);
          if(Math.abs(contrast) < Math.abs(new Color(spectrum[color][tone]).contrast(spectrum[color]['l-0'], "APCA")) ){
            textStep=0;
            var colorText = new Color(spectrum[color][`l-${textStep}`]);
            var contrast = (new Color(spectrum[color][tone]).contrast(colorText, "APCA")).toFixed(2);
          }

          let textColor=`var(--c-${color}-l-${textStep})`;
          output += `<div class="swatch c-${color}-${tone}" style="--swatch-bg:var(--c-${color}-${tone}); --swatch-text:${textColor}; --swatch-border:var(--c-${color}-l-${borderStep});">${contrast}</div>`;
        });
      });
      outDiv.innerHTML = output;
      return outDiv;
    };

    this.toCssVar = function (colorName, scale) {
      var styleOut = document.createElement('style');
      styleOut.innerHTML = `:root{`;
      Object.keys(scale).forEach(function (step) {
//        styleOut.innerHTML += `--c-${colorName}-${step}:${scale[step].toGamut({method:'css',space:"srgb"})};`;
        styleOut.innerHTML += `--c-${colorName}-${step}:${scale[step].to("hsl")};`;
      });
      styleOut.innerHTML += `}`;
      styleOut.innerHTML += `\r.c-${colorName}{`;
      Object.keys(scale).forEach(function (step) {
        styleOut.innerHTML += `--c-${step}:${scale[step]};`;
      });
      styleOut.innerHTML += `
      --c-bg:var(--c-l-0);
      --c-bg-subtle:var(--c-l-1);
      --c-bg-ui:var(--c-l-2);
      --c-bg-ui-hover:var(--c-l-3);
      --c-bg-ui-active:var(--c-l-4);
      --c-border:var(--c-l-5);
      --c-border-ui:var(--c-l-6);
      --c-border-ui-hover:var(--c-l-7);
      --c-solidbg:var(--c-l-8);
      --c-solidbg-hover:var(--c-l-9);
      --c-text-lc:var(--c-l-10);
      --c-text-hc:var(--c-l-11);    
    }`;



      return styleOut;
    };

    this.printTheme = function (colors) {
      var toCssVar = this.toCssVar;
      var fwTheme = document.createElement('div');
      Object.keys(colors).forEach(function (color, var2) {
        fwTheme.appendChild(toCssVar(color, colors[color]));
      });
      return fwTheme;
    };
  }

  _onChange(e) {
    // change to recalc styles.

    // TODO ?
    // add serve from local storage.
    // refactor color getter / color setter so we don't need color.js until it's needed.
    // - Color picker/scheme maker.
    // - Color chip, color stops, color gradient
    // - component examples of each color
    //   - button
    //   - text, knockout header
    //   - h1, h2, h3, p, input, etc.
    // - Add default scheme using css variables.
    // - Diagram of how the color system works.

    // FW-THEME-EDIT: Call recalculation path (load new libraries)
    // display calculated styles.
    // FW-THEME-STYLES
    // <style id='theme-themeType-color' />
    let fwThemeColor=e.target.value;
    this.colors[this.themeClass] = this.makeColor(fwThemeColor);

    this.setAttribute('fw-theme-color',fwThemeColor);
 
    e.target.parentElement.lastChild.innerHTML ='';
    e.target.parentElement.lastChild.appendChild( this.printTheme(this.colors) );
    e.target.nextElementSibling.innerHTML ='';
    e.target.nextElementSibling.appendChild( this.outputSpectrum(this.colors) );
    this.dispatchEvent(new CustomEvent('color-changed'));
  }
  

  render() {
    return html`
      <div class="theme-color-spectrum c-${this.themeClass}">
        <div class="swatch-card">
          <input
            @change=${this._onChange}
            value=${this.color}
            type="color"
          />
          <h2>${this.themeClass}</h2>
          ${this.outputSpectrum(this.colors)}
        </div>
      </div>
      <div class="theme-styles">${this.printTheme(this.colors)}</div>`;
  }
  createRenderRoot() {
    return this;
  }


}

window.customElements.define('fw-theme', FwTheme);
