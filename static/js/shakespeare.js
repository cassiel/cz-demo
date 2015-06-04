// Generated by CoffeeScript 1.8.0
(function() {
  var HEIGHT, INNER_RADIUS, OUTER_RADIUS, RADIUS, WIDTH, angle, arc, arcTween, autoGo, color, createArcs, createText, makeArc, makePie, svg, totalCount, transitionArcs, transitionText;

  WIDTH = 600;

  HEIGHT = 600;

  RADIUS = Math.min(WIDTH, HEIGHT) / 2;

  OUTER_RADIUS = RADIUS - (WIDTH / 10);

  INNER_RADIUS = RADIUS - (WIDTH / 6);

  color = d3.scale.category20();

  svg = d3.select("div#inner").append("svg").attr("width", WIDTH).attr("height", HEIGHT).append("g").attr("transform", "translate(" + (WIDTH / 2) + ", " + (HEIGHT / 2) + ")");

  angle = function(d) {
    var a;
    a = (d.startAngle + d.endAngle) * 90 / Math.PI - 90;
    if (a > 90) {
      return a - 180;
    } else {
      return a;
    }
  };

  totalCount = function(data) {
    return data.map(function(x) {
      return x.value;
    }).reduce((function(x1, x2) {
      return x1 + x2;
    }), 0);
  };

  makeArc = function() {
    return d3.svg.arc().outerRadius(OUTER_RADIUS).innerRadius(INNER_RADIUS);
  };

  makePie = function() {
    return d3.layout.pie().sort(null).value(function(d) {
      return +d.value;
    });
  };

  createArcs = function(g, arc) {
    return g.append("path").attr("d", arc).style("fill", function(d, i) {
      return color(i);
    }).each(function(d) {
      console.log("enter on " + JSON.stringify(d));
      return this._current = d.data;
    });
  };

  createText = function(g, arc) {
    return g.append("text").attr("transform", function(d) {
      var r, t;
      t = "translate(" + (arc.centroid(d)) + ")";
      r = "rotate(" + (angle(d)) + ")";
      return t + r;
    }).attr("dy", ".35em").style("text-anchor", "middle").text(function(d) {
      return d.data.text;
    });
  };

  transitionArcs = function(data, arc) {
    return data.select("path").transition().delay(250).duration(2000).attrTween("d", arcTween(arc));
  };

  transitionText = function(data, arc) {
    return data.select("text").text(function(d) {
      if (d.data.value > 0) {
        return d.data.text;
      } else {
        return null;
      }
    }).attr("fill-opacity", "0.0").attr("transform", function(d) {
      var r, t;
      t = "translate(" + (arc.centroid(d)) + ")";
      r = "rotate(" + (angle(d)) + ")";
      return t + r;
    }).transition().duration(500).delay(2250).attr("fill-opacity", "1.0");
  };

  arc = makeArc();

  this.go = function(word) {
    return d3.json("/shake/" + word, function(error, json) {
      var data, g, pie;
      if (error) {
        return console.warn(error);
      } else {
        if ((totalCount(json.result)) === 0) {
          svg.selectAll(".arc path").transition().duration(500).attr("fill-opacity", "0.0");
          return svg.selectAll(".arc text").transition().duration(500).attr("fill-opacity", "0.0");
        } else {
          svg.selectAll(".arc path").transition().duration(250).attr("fill-opacity", "1.0");
          pie = makePie();
          data = svg.selectAll(".arc").data(pie(json.result));
          g = data.enter().append("g").attr("class", "arc");
          createArcs(g, arc);
          createText(g, arc);
          transitionArcs(data, arc);
          transitionText(data, arc);
          return data.exit().remove();
        }
      }
    });
  };

  arcTween = function(arc) {
    return function(a) {
      var i;
      i = d3.interpolate(this._current, a);
      this._current = i(0);
      return function(t) {
        return arc(i(t));
      };
    };
  };

  $("#type-in").bind('input', function() {
    var text;
    text = $(this).val();
    if (text === "") {
      text = "*BOGUS*";
    }
    return go(text);
  });

  autoGo = function(word) {
    $("#type-in").val(word);
    return go(word);
  };

  setTimeout((function() {
    return autoGo("love");
  }), 10000);

}).call(this);
