<template>
  <div>
    <svg id="viz"></svg>
  </div>
</template>

<script>
  /* eslint-disable no-console */

  import * as d3 from 'd3'
  export default {
    name: 'Network',
    methods: {
      handleClick (d) {
        this.$emit('openModal', d)
      }
    },
    mounted () {
      let that = this
      let width = 1200
      let height = 800
      let color = d3.scaleOrdinal(d3.schemeSpectral[9])
      d3.json('http://localhost:8080/static/json/miserables.json').then(function (graph) {
        let label = {
          'nodes': [],
          'links': []
        }
        graph.nodes.forEach(function (d, i) {
          label.nodes.push({ node: d })
          label.nodes.push({ node: d })
          label.links.push({
            source: i * 2,
            target: i * 2 + 1
          })
        })

        let labelLayout = d3.forceSimulation(label.nodes)
          .force("center", d3.forceCenter(width / 2, height / 2))
          .force('charge', d3.forceManyBody().strength(-50))
          .force('link', d3.forceLink(label.links).distance(0).strength(2))

        let graphLayout = d3.forceSimulation(graph.nodes)
          .force('charge', d3.forceManyBody().strength(-3000))
          .force('center', d3.forceCenter(width / 2, height / 2))
          .force('x', d3.forceX(width / 2).strength(1))
          .force('y', d3.forceY(height / 2).strength(1))
          .force('link', d3.forceLink(graph.links).id(function (d) { return d.id }).distance(50).strength(1))
          .on('tick', ticked)

        let adjlist = []

        graph.links.forEach(function (d) {
          adjlist[d.source.index + '-' + d.target.index] = true
          adjlist[d.target.index + '-' + d.source.index] = true
        })

        function neigh (a, b) {
          return a === b || adjlist[a + '-' + b]
        }
        let svg = d3.select('#viz').attr('width', width).attr('height', height)
        let container = svg.append('g')

        svg.call(
          d3.zoom()
            .scaleExtent([.1, 4]) // eslint-disable-line
            .on('zoom', function () { container.attr('transform', d3.event.transform) })
        )

        let link = container.append('g').attr('class', 'links')
          .selectAll('line')
          .data(graph.links)
          .enter()
          .append('line')
          .attr('stroke', '#aaa')
          .attr('stroke-width', '1px')

        let node = container.append('g').attr('class', 'nodes')
          .selectAll('g')
          .data(graph.nodes)
          .enter()
          .append('circle')
          .attr('r', function (d) {
            console.log(d)
            return Math.ceil(Math.random()*40);
          })
          .attr('fill', function (d) { return color(d.group) })

        node.on('mouseover', focus).on('mouseout', unfocus)

        let timeout = null;

        node.on("click", function(d) {
          clearTimeout(timeout);
          timeout = setTimeout(function() {
            console.clear();
            console.log("node was single clicked", new Date());
          }, 300)
          console.log(d.id)
          singleClick(d.id)
        })
          .on("dblclick", function(d) {
            clearTimeout(timeout);
            console.clear();
            console.log("node was double clicked", new Date());
          });

        node.call(
          d3.drag()
            .on('start', dragstarted)
            .on('drag', dragged)
            .on('end', dragended)
        )

        function singleClick(val) {
          console.log("mounted single click")
          console.log(val)
          console.log(that)
          that.handleClick(val)
        }

        let labelNode = container.append('g').attr('class', 'labelNodes')
          .selectAll('text')
          .data(label.nodes)
          .enter()
          .append('text')
          .text(function (d, i) { return i % 2 === 0 ? '' : d.node.id })
          .style('fill', '#555')
          .style('font-family', 'Arial')
          .style('font-size', 12)
          .style('pointer-events', 'none') // to prevent mouseover/drag capture

        function ticked () {
          node.call(updateNode)
          link.call(updateLink)

          labelLayout.alphaTarget(0.3).restart()
          labelNode.each(function (d, i) {
            if (i % 2 === 0) {
              d.x = d.node.x
              d.y = d.node.y
            } else {
              let b = this.getBBox()

              let diffX = d.x - d.node.x
              let diffY = d.y - d.node.y

              let dist = Math.sqrt(diffX * diffX + diffY * diffY)

              let shiftX = b.width * (diffX - dist) / (dist * 2)
              shiftX = Math.max(-b.width, Math.min(0, shiftX))
              let shiftY = 16
              this.setAttribute('transform', 'translate(' + shiftX + ',' + shiftY + ')')
            }
          })

          labelNode.each(collide(0.5))
          labelNode.call(updateNode)
        }

        function fixna (x) {
          if (isFinite(x)) return x
          return 0
        }

        function focus (d) {
          console.log("focus")
          let index = d3.select(d3.event.target).datum().index
          node.style('opacity', function (o) {
            return neigh(index, o.index) ? 1 : 0.1
          })
          labelNode.attr('display', function (o) {
            return neigh(index, o.node.index) ? 'block' : 'none'
          })
          link.style('opacity', function (o) {
            return o.source.index === index || o.target.index === index ? 1 : 0.1
          })
        }

        function unfocus () {
          labelNode.attr('display', 'block')
          node.style('opacity', 1)
          link.style('opacity', 1)
        }

        function updateLink (link) {
          link.attr('x1', function (d) { return fixna(d.source.x) })
            .attr('y1', function (d) { return fixna(d.source.y) })
            .attr('x2', function (d) { return fixna(d.target.x) })
            .attr('y2', function (d) { return fixna(d.target.y) })
        }

        function updateNode (node) {
          node.attr('transform', function (d) {
            return 'translate(' + fixna(d.x) + ',' + fixna(d.y) + ')'
          })
        }

        function dragstarted (d) {
          d3.event.sourceEvent.stopPropagation()
          if (!d3.event.active) graphLayout.alphaTarget(0.3).restart()
          d.fx = d.x
          d.fy = d.y
        }

        function dragged (d) {
          d.fx = d3.event.x
          d.fy = d3.event.y
        }

        function dragended (d) {
          if (!d3.event.active) graphLayout.alphaTarget(0)
          d.fx = null
          d.fy = null
        }

        function collide(alpha) {
          let quadtree = d3.quadtree(graph.nodes);
          return function(d) {
            let radius = 400
            let padding = 400
            let rb = 2*radius + padding,
              nx1 = d.x - rb,
              nx2 = d.x + rb,
              ny1 = d.y - rb,
              ny2 = d.y + rb;

            quadtree.visit(function(quad, x1, y1, x2, y2) {
              if (quad.point && (quad.point !== d)) {
                let x = d.x - quad.point.x,
                  y = d.y - quad.point.y,
                  l = Math.sqrt(x * x + y * y);
                if (l < rb) {
                  l = (l - rb) / l * alpha;
                  d.x -= x *= l;
                  d.y -= y *= l;
                  quad.point.x += x;
                  quad.point.y += y;
                }
              }
              return x1 > nx2 || x2 < nx1 || y1 > ny2 || y2 < ny1;
            });
          };
        }
      })
    }
  }
</script>
<style scoped>
  svg {
    /* border: 1px solid #ccc; */
    width: 100%;
  }
</style>
<style>
  .links line {
    stroke: #999;
    stroke-opacity: 0.6;
  }

  .nodes circle {
    stroke: #fff;
    stroke-width: 1px;
  }
</style>
