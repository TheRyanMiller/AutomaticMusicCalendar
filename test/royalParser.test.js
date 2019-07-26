var expect    = require("chai").expect;
var royalScraper = require("../royalScraper");
var vinatageMarket = require("./htmlSamples/holyCityVintageMarket.js");
var diz = require("./htmlSamples/diz.js");
var divas = require("./htmlSamples/divasOfBrunch.js"); //Similar to MARKET but has doors times

describe("Royal American Parser", function() {
  describe("Parse an all-day market", function() {
    it("Get artist", function() {
      //console.log(vinatageMarket);
      var article = royalScraper.parseArtist(vinatageMarket.article);
      expect(article).to.equal("Holy City Vintage Market")
    });
    it("Get description", function() {
      //console.log(vinatageMarket);
      var article = royalScraper.parseArtist(vinatageMarket.article);
      expect(article).to.equal("Affordable vintage clothing, accessories, and decor + handmade goods - all from small, local businesses!! Plus, a special solo set from DUMB Doctors!")
    });
  });
  describe("Parse DJ Set", function() {
    it("Get artist", function() {
      //console.log(vinatageMarket);
      var article = royalScraper.parseArtist(diz.article);
      expect(article).to.equal("D!Z (Vinyl DJ)");
    });
    it("Get description", function() {
      //console.log(vinatageMarket);
      var article = royalScraper.parseArtist(diz.article);
      expect(article).to.equal("Dance party featuring the sounds of D!Z spinning funky soul 45s all night long!!");
    });
  });
  describe("Parse Divas of Brunch", function() {
    it("Get artist", function() {
      //console.log(vinatageMarket);
      var article = royalScraper.parseArtist(divas.article);
      expect(article).to.equal("The Divas of Drag Brunch");
    });
    it("Get description", function() {
      //console.log(vinatageMarket);
      var article = royalScraper.parseArtist(divas.article);
      expect(article).to.equal("A benefit for We Are Family. Presented by Vive Le Rock Productions!");
    });
  });
});