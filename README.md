# DocsJS
See a live example [here](https://hailiax.io/docsjs)<br>
Insert the following script tag and theme to use DocsJS:
```
<script type="text/javascript" src="https://cdn.jsdelivr.net/gh/Hailiax/DocsJS@1/src/docs.min.js"></script>
<style>
	@import url('https://cdnjs.cloudflare.com/ajax/libs/meyer-reset/2.0/reset.min.css');
	@import url('https://fonts.googleapis.com/css?family=Lato:300,400,700');
	body,html{
		font-family: 'Lato', sans-serif;
		font-weight: 400;
		margin: 0;
		padding: 0;
	}
	[docsjs-tag="DocsJS-This-Baby"]{
		color: #000;
		font-size: 20px;
		line-height: 1.4em;
		position: relative;
		overflow: hidden;
		behavior: url(https://cdn.jsdelivr.net/css3pie/2.0b1/PIE.htc);
		-webkit-tap-highlight-color: rgba(0,0,0,0);
		-webkit-text-size-adjust: 100%;
		/* GPU accel hack. Also, inverting colors is an option in the menu for day/night readability. */
		-webkit-filter: invert(0%);
		filter: invert(0%);
	}
	[docsjs-tag="bg"]:before{
		content: "";
		position: fixed;
		width: 100%; height: 100%;
		background-image: url(https://source.unsplash.com/1600x900?sunrise,mountains);
		background-position: center;
		background-size: 0;
		background-size: cover;
		top: 0; left: 0;
		opacity: 0.7;
		filter: blur(15px);
		-moz-filter: blur(15px);
		-webkit-filter: blur(15px);
		-o-filter: blur(15px);
	}
	[docsjs-tag="bg"]{
		background: url(https://source.unsplash.com/1600x900?sunrise,mountains);
		background-size: cover;
		background-position: center;
		position: fixed;
		height: 100%; top: 0;
		width: 100%; left: 0;
	}
	[docsjs-tag="column-left"],[docsjs-tag="column-right"]{
		height: 100%;
		top: 0;
	}
	[docsjs-tag="column-handle"]{
		position: absolute;
		top: 0;
		height: 100%;
		width: 2em;
		cursor: pointer;
		cursor: ew-resize;
	}
	[docsjs-tag="column-left"] [docsjs-tag="column-handle"]{
		left: 100%;
		margin-left: -1em;
	}
	[docsjs-tag="column-right"] [docsjs-tag="column-handle"]{
		margin-left: -1em;
	}
	[docsjs-tag="column-handle-inner"]{
		position: absolute;
		opacity: 0.2;
		height: 100%;
		width: 0.25em;
		display: none;
		box-shadow: 0 0 0.4em 0.075em rgba(0,0,0,1);
		left: 0; right: 0; margin-left: auto; margin-right: auto;
	}
	[docsjs-tag="column-filler"]{
		position: relative;
		background-color: rgba(255,255,255,0.95);
	}
	[docsjs-tag="column-content"]{
		position: relative;
		background-color: rgba(255,255,255,0.85);
		padding: 1em;
		overflow: hidden;
	}
	[docsjs-tag="column-content"] [docsjs-tag="tl"]{
		background: none;
		padding-left: 0;
		padding-right: 0;
		border-bottom: solid 0.05em rgba(255,255,255,0.95);
	}
	[docsjs-tag="menu"]{
		position: relative;
		background-color: #FFF;
		padding: 1em;
		border-bottom: #E0E0E0 solid 1px;
		overflow: hidden;
	}
	[docsjs-tag="column-left"] [docsjs-tag="menu"]{
		background-color: transparent;
		border-bottom: none;
	}
	[docsjs-tag='menu-preferences']{
		position: relative;
		width: 100%;
		text-align: center;
	}
	[docsjs-tag='menu-preferences-item']{
		display: inline-block;
		cursor: pointer;
		font-size: 1.8em;
		width: 1em;
		height: 1em;
		padding: 0.25em;
		padding-top: 0;
		opacity: 1;
	}
	[docsjs-tag='menu-title']{
		line-height: 1.8em;
	}
	[docsjs-tag='menu-item']{
		border-left: solid 0.05em #E0E0E0;
		padding-left: 0.5em;
	}
	[docsjs-tag='menu-item']:hover{
		border-left: solid 0.05em #888;
		cursor: pointer;
	}
	[docsjs-tag="sc"]{
		position: relative;
		padding: 1em;
		background-color: rgba(0,0,0,0.3);
		-pie-background:  rgba(0,0,0,0.3);
		margin-top: 1em;
		box-sizing: border-box;
		-webkit-box-sizing: border-box;
		-moz-box-sizing: border-box;
		box-sizing: border-box;
		overflow: hidden;
		*behavior: url(https://raw.github.com/Schepp/box-sizing-polyfill/master/boxsizing.htc);
	}
	[docsjs-tag="hd"]{
		
	}
	[docsjs-tag="hd"],[docsjs-tag="tp"]{
		position: relative;
		margin-top: 1em;
		overflow: hidden;
	}
	[docsjs-tag="tp"] > [docsjs-tag="sc"]{
		border-bottom: solid 1em #FFF;
		margin-top: 0;
	}
	[docsjs-tag="hd"],[docsjs-tag="tp"]:first-child{
		margin-top: 0;
	}
	[docsjs-tag="ebefore"]{
		position: relative;
		background-color: #FFF;
		height: 1.75em;
		line-height: 1.75em;
		padding-left: 2.4em;
		border-top: #E0E0E0 solid 1px;
		cursor: pointer;
	}
	[docsjs-tag="button-ebefore"]{
		position: absolute;
		height: 1em;
		width: 1em;
		margin-left: -1.4em;
		top: 0; bottom: 0; margin-top: auto; margin-bottom: auto;
		cursor: pointer;
	}
	[docsjs-tag="efiller"]{
		position: relative;
		/*background-color: rgba(255,255,255,0.2);*/
	}
	[docsjs-tag="tx"],[docsjs-tag="eg"],[docsjs-tag="ex"]{
		position: relative;
		background-color: #FFF;
		padding: 1em;
		overflow: hidden;
	}
	[docsjs-tag="tl"]{
		position: relative;
		background-color: rgba(255,255,255,0.85);
		padding: 0.83333333em;
		padding-right: 3em;
		font-size: 1.2em;
		cursor: pointer;
	}
	[docsjs-tag="button-minimize"],[docsjs-tag="button-menu"]{
		position: absolute;
		font-size: 1.6em;
		height: 1em;
		width: 1em;
		border: solid 0.4em transparent;
		left: 0; right: 0; margin-left: auto; margin-right: 0;
		top: 0; bottom: 0; margin-top: auto; margin-bottom: auto;
		cursor: pointer;
	}
	[docsjs-tag="button-parent"]{
		background-color: transparent;
		height: 1em;
		width: 1em;
		position: relative;
	}
	[docsjs-tag="button-child"]{
		background-color: #000;
		border-color: #000;
		color: #000;
		position: absolute;
		border-style: solid;
		width: 0.1em;
		height: 0.1em;
		border-width: 0.075em;
		-webkit-border-radius: 0.1em;
		-moz-border-radius: 0.1em;
		border-radius: 0.1em;
		left: 0; right: 0; top: 0; bottom: 0; margin-left: auto; margin-right: auto; margin-top: auto; margin-bottom: auto;
	}
	[docsjs-tag="ex"][docsjs-state="min"],[docsjs-tag="eg"][docsjs-state="min"]{
		padding-top: 0;
		padding-bottom: 0;
		height: 0;
	}
</style>
```
