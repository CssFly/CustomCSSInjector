# CustomCSSInjector
Small CSS injector for referencing custom Style Sheet Files configured by URL.

Author: Philipp Hennermann 2015
License: M.I.T.

Usage: 1. insert <script src="path/to/CustomCSS.js"></script> before closing </head> tag in your HTML
       2. external style sheets will be injected here
       3. you can activate the injection of external CSS by modifing the URL of your page, e.g. by URL-Parameter

          http://www.example.com/?customCSSpath=http://www.otherpage.com/style.css OR by Hash:
          http://www.example.com/#customCSSpath=http://www.otherpage.com/style.css
          http://www.example.com/#customCSSpath=http://www.otherpage.com/style_1.css,http://www.otherpage.com/style_2.css

          This will create a localStorage entry that serves the referenced CSS file by magic until you
          call your page with the parameter "off", e.g. by URL-Parameter

          http://www.example.com/?customCSSpath=off OR by Hash
          http://www.example.com/#customCSSpath=off
