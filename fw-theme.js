/**
 * @license
 * Copyright 2019 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */

import {LitElement, html, css} from 'lit';
import Color from "colorjs.io";

/**
 * An example element.
 *
 * @fires count-changed - Indicates when the count changes
 * @slot - This element has a slot
 * @csspart button - The button
 */
export class FwTheme extends LitElement {
  static get styles() {
    return css`
      :host {
        display: block;
        border: solid 1px gray;
        padding: 16px;
        max-width: 800px;
      }
      .swatch-card{
        display:grid;
        grid-template-columns:repeat(9,1fr);
        grid-template-rows:repeat(auto, 4em);
      }
      .swatch-card h2{
        grid-row:1;
        grid-column:1 / span 9;
      }
      .swatch{
        grid-row:2;
        width:100%;
        height:3em;
      }
    `;
  }

  static get properties() {
    return {
      /**
       * The name to say "Hello" to.
       * @type {string}
       */
      name: {type: String},

      /**
       * The number of times the button has been clicked.
       * @type {number}
       */
      count: {type: Number},
    };
  }

  constructor() {
    super();
    this.name = 'World';
    this.count = 0;
    this.colors={};
    this.brand="hsl(201 100% 31%)";

    this.complement = 
    new Color(this.brand).to('hsl').set('h', (new Color(this.brand).h+180) % 360 ).to('hsl');

    
    
    //Style Layer

    this.makeColor = function(color){
      var scaling = [
        {l:99.5,s:100},
        {l:98,s:100},
        {l:97,s:95},
        {l:95,s:90},
        {l:80,s:75},
        {l:50,s:50},
        {l:30,s:65},
        {l:20,s:75},
        {l:15,s:85},
        {l:5,s:100}
      ];
      var colors=[];
      scaling.forEach(function(scale,count){
        colors['l-'+count]=new Color(color).to('hsl').set('l',scale.l).set('s',scale.s)
      })
      return colors;
    };

    this.colors.brand = this.makeColor(this.brand);
    this.colors.primary = this.makeColor('blue');
    this.colors.complement = this.makeColor(this.complement);

    this.outputSpectrum=function(spectrum){
      console.log(spectrum);
      let outDiv=document.createElement('div');
      var output=``;
      Object.keys(spectrum).forEach(function(color){
        output += `<div class="swatch-card"><h2>${color}</h2>
        `;
       Object.keys(spectrum[color]).forEach(function(tone){
        output+= `<div class="swatch c-${color}-${tone}" style="background-color:var(--c-${color}-${tone})"></div>`
       })
       output += `</div>`;
      })
      outDiv.innerHTML= output;
      return outDiv;
    }

    this.toCssVar=function(colorName, scale){
      var styleOut=document.createElement('style');
      styleOut.innerHTML=`:host{`;
      Object.keys(scale).forEach(function(step){
          styleOut.innerHTML+=`--c-${colorName}-${step}:${scale[step]};`;
      })
      styleOut.innerHTML+=`}`;
      return styleOut
    }

  }

  render() {
    return html`
    <div>
      <input @change=${this._onChange} type="color" />
      <slot></slot>
    </div>
    <div class="theme-color-spectrum">${ this.outputSpectrum(this.colors) }</div>
    <div class="theme-styles">
      ${ this.toCssVar('primary',this.colors.primary) } 
      ${ this.toCssVar('complement',this.colors.complement) } 
      ${ this.toCssVar('brand',this.colors.brand) } 
    </div>`;
  }

  _onChange() {
    // change to recalc styles.
      // TODO ? does style exist in localStorage
      // FW-THEME-EDIT: Call recalculation path (load new libraries)
    // display calculated styles.
    // FW-THEME-STYLES
      // <style id='theme-themeType-color' />
    this.count++;
    this.dispatchEvent(new CustomEvent('count-changed'));
  }

  /**
   * Formats a greeting
   * @param name {string} The name to say "Hello" to
   * @returns {string} A greeting directed at `name`
   */
  sayHello(name) {
    return `Hello, ${name}`;
  }
}

window.customElements.define('fw-theme', FwTheme);
