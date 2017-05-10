var smartquotes = require("smartquotes").string;

module.exports = function(theme) {

  // Do some typechecking
  var left = ifNumeric(theme.captionLeft, 0),
      right = ifNumeric(theme.captionRight, theme.width),
      bottom = ifNumeric(theme.captionBottom, null),
      top = ifNumeric(theme.captionTop, null),
      labelLeft = ifNumeric(theme.labelLeft, 0),
      labelRight = ifNumeric(theme.labelRight, theme.width),
      labelBottom = ifNumeric(theme.labelBottom, null),
      labelTop = ifNumeric(theme.labelTop, null),

      renderfunctions ;

  if (bottom === null && top === null) {
    top = 0;
  }

  if (labelBottom === null && labelTop === null) {
    labelTop = 0;
  }

  var captionWidth = right - left,
      labelWidth = labelRight - labelLeft;

  return function(context, caption, type) {

    if (!caption) {
      return;
    }

    if (type === 'caption') {
      var lines = [[]],
          maxWidth = 0,
          words = smartquotes(caption + "").trim().replace(/\s\s+/g, " \n").split(/ /g);

      context.font = theme.captionFont;
      context.textBaseline = "top";
      context.textAlign = theme.captionAlign || "center";

      // Check whether each word exceeds the width limit
      // Wrap onto next line as needed
      words.forEach(function(word,i){

        var width = context.measureText(lines[lines.length - 1].concat([word]).join(" ")).width;

        if (word[0] === "\n" || (lines[lines.length - 1].length && width > captionWidth)) {

          word = word.trim();
          lines.push([word]);
          width = context.measureText(word).width;

        } else {

          lines[lines.length - 1].push(word);

        }

        maxWidth = Math.max(maxWidth,width);

      });

      var totalHeight = lines.length * theme.captionLineHeight + (lines.length - 1) * theme.captionLineSpacing;

      // horizontal alignment
      var x = theme.captionAlign === "left" ? left : theme.captionAlign === "right" ? right : (left + right) / 2;

      // Vertical alignment
      var y;

      if (top !== null && bottom !== null) {
        // Vertical center
        y = (bottom + top - totalHeight) / 2;
      } else if (bottom !== null) {
        // Vertical align bottom
        y = bottom - totalHeight;
      } else {
        // Vertical align top
        y = top;
      }

      // draw caption
      context.fillStyle = theme.captionColor;
      lines.forEach(function(line, i){

        // negative indentation for opening quotes
        var indented_x = (x + 28);

        if (i === 0 && /^“/.test(line[0])) {
          context.fillText(line.join(" "), x, y + i * (theme.captionLineHeight + theme.captionLineSpacing));
        }
        else {
          context.fillText(line.join(" "), indented_x, y + i * (theme.captionLineHeight + theme.captionLineSpacing));
        }
      });
    } // end if caption


    if (type === 'label' && caption != 'None') {
      var lines = [[]],
          maxWidth = 0,
          words = smartquotes(caption + "").trim().replace(/\s\s+/g, " \n").split(/ /g);

      context.font = theme.labelFont;
      context.textBaseline = "top";
      context.textAlign = theme.labelAlign || "center";

      // Check whether each word exceeds the width limit
      // Wrap onto next line as needed
      words.forEach(function(word,i){

        var width = context.measureText(lines[lines.length - 1].concat([word]).join(" ")).width;

        if (word[0] === "\n" || (lines[lines.length - 1].length && width > labelWidth)) {

          word = word.trim();
          lines.push([word]);
          width = context.measureText(word).width;

        } else {

          lines[lines.length - 1].push(word);

        }

        maxWidth = Math.max(maxWidth,width);

      });

      var totalHeight = lines.length * theme.labelLineHeight + (lines.length - 1) * theme.labelLineSpacing;

      // horizontal alignment
      var x = theme.labelAlign === "left" ? labelLeft : theme.labelAlign === "right" ? labelRight : (labelLeft + labelRight) / 2;

      // Vertical alignment
      var y;

      if (labelTop !== null && labelBottom !== null) {
        // Vertical center
        y = (labelBottom + labelTop - totalHeight) / 2;
      } else if (labelBottom !== null) {
        // Vertical align bottom
        y = labelBottom - totalHeight;
      } else {
        // Vertical align top
        y = labelTop;
      }

      // draw label
      context.fillStyle = theme.labelColor;
      lines.forEach(function(line, i){
        context.fillText(line.join(" "), x, y + i * (theme.labelLineHeight + theme.labelLineSpacing));
      });
    }

 };


}

function ifNumeric(val, alt) {
  return (typeof val === "number" && !isNaN(val)) ? val : alt;
}
