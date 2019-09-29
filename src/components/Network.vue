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
      handleClick(d) {
        this.$emit('openModal', d)
      }
    },
    mounted() {
      let that = this;
      let height = window.innerHeight;
      let width = window.innerWidth;
      let color = d3.scaleOrdinal(d3.schemePaired);
      let globalNode = null;
      d3.json('/static/json/relations.json').then(function (graph) {
        let label = {
          'nodes': [],
          'links': []
        }

        let maxVal = 15
        console.log(graph.nodes)
        graph.nodes.forEach(function (d, i) {
          maxVal = Math.max(maxVal, d.score)
        })

        graph.nodes.forEach(function (d, i) {
          let minVal = 0.1
          if (d.score === null) d.score = minVal
          d.score = (d.score - minVal) / maxVal
          d.score = Math.max(d.score, minVal)
          // console.log(d.score)
          label.nodes.push({node: d})
          label.nodes.push({node: d})
          label.links.push({
            source: i * 2,
            target: i * 2 + 1
          })
        })
        console.log(width / 2)
        console.log(height / 2)

        let labelLayout = d3.forceSimulation(label.nodes)
          .force("center", d3.forceCenter(width / 2, height / 2))
          .force('charge', d3.forceManyBody().strength(-50))
          .force('link', d3.forceLink(label.links).distance(0).strength(2))

        let graphLayout = d3.forceSimulation(graph.nodes)
          .force('charge', d3.forceManyBody().strength(-2500))
          .force('center', d3.forceCenter(width / 2, height / 2))
          .force('x', d3.forceX(width / 2).strength(1))
          .force('y', d3.forceY(height / 2).strength(1))
          .force('link', d3.forceLink(graph.links).id(function (d) {
            return d.id
          }).distance(30).strength(0.8))
          .on('tick', ticked)

        let adjlist = []

        graph.links.forEach(function (d) {
          adjlist[d.source.index + '-' + d.target.index] = true
          adjlist[d.target.index + '-' + d.source.index] = true
        })

        function neigh(a, b) {
          return a === b || adjlist[a + '-' + b]
        }

        let svg = d3.select('#viz').attr('width', width).attr('height', height)
        let container = svg.append('g')

        svg.call(
          d3.zoom()
            .scaleExtent([.1, 4]) // eslint-disable-line
            .on('zoom', function () {
              // let e = event || window.event;
              // stopDefault(e);
              container.attr('transform', d3.event.transform)
            })
        )

        /*
        function stopDefault(e) {
          if (e && e.preventDefault)
            e.preventDefault();
          else
            window.event.returnValue = false;
          return false;
        }*/

        let link = container.append('g').attr('class', 'links')
          .selectAll('line')
          .data(graph.links)
          .enter()
          .append('line')
          .attr('stroke', '#aaa')
          .attr('stroke-width', '1.5px')

        let node = container.append('g').attr('class', 'nodes')
          .selectAll('g')
          .data(graph.nodes)
          .enter()
          .append('circle')
          .attr('r', function (d) {
            return d.score * 40
          })
          .attr('fill', function (d) {
            return color(Math.floor(Math.random() * 5))
          })

        node.on('mouseover', focus).on('mouseout', unfocus)

        let timeout = null;

        node.on("click", function (d) {
          clearTimeout(timeout);
          timeout = setTimeout(function () {
            console.log("node was single clicked", new Date());
          }, 300)
          singleClick(d.id)
        })
          .on("dblclick", function (d) {
            clearTimeout(timeout);
            console.log("node was double clicked", new Date());
          });

        node.call(
          d3.drag()
            .on('start', dragstarted)
            .on('drag', dragged)
            .on('end', dragended)
        )

        function singleClick(val) {
          that.handleClick(val)
          if (globalNode != null) {
            globalNode.attr("fill", "#33a02c");
            globalNode = null
          }
        }

        let labelNode = container.append('g').attr('class', 'labelNodes')
          .selectAll('text')
          .data(label.nodes)
          .enter()
          .append('text')
          .text(function (d, i) {
            return i % 2 === 0 ? '' : d.node.id
          })
          .style('fill', '#555')
          .style('font-family', 'Arial')
          .style('font-size', 14)
          .style('pointer-events', 'none') // to prevent mouseover/drag capture

        that.$on('searchProfile', (keyword) => {
          console.log(keyword)

          let selectedNode = node
            .filter(function (d, i) {
              return d.id === keyword
            })
          let previousNode = globalNode;
          if (previousNode !== null) {
            previousNode.datum().fx = null;
            previousNode.datum().fy = null;
            previousNode.attr("fill", "#33a02c");
          }
          globalNode = selectedNode;
          console.log(selectedNode)
          selectedNode.datum().fx = width / 2
          selectedNode.datum().fy = height / 2
          let rate = 1;

          let interval = setInterval(() => {
            graphLayout.alphaTarget(rate).restart()
            rate -= 0.03;
            console.log("rate" + rate)
            if (rate < 0.15) {
              clearInterval(interval);
            }

          }, 200);
          // let dx = width / 2 - selectedNode.datum().x
          // let dy = height / 2 - selectedNode.datum().y
          // svg.attr("transform", "translate(" + dx + "," + dy + ")" + "scale(" + 1.2 + ")")
          selectedNode.attr("fill", "#EEC244")
          //svg.attr("width", width).attr("height", height);

        })

        function ticked() {
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

        function fixna(x) {
          if (isFinite(x)) return x
          return 0
        }

        function focus(d) {
          let index = d3.select(d3.event.target).datum().index
          node.transition()
            .delay(2)
            .duration(300)
            .style('opacity', function (o) {
              return neigh(index, o.index) ? 1 : 0.2
            })

          node.style('r', function (o) {
            return o === d ? o.score * 50 : o.score * 40
          })
          labelNode.transition()
            .delay(5)
            .duration(300)
            .attr('display', function (o) {
              return neigh(index, o.node.index) ? 'block' : 'none'
            })
          link.transition()
            .delay(2)
            .duration(300)
            .style('opacity', function (o) {
              return o.source.index === index || o.target.index === index ? 1 : 0.2
            })
        }

        function unfocus(d) {
          node.transition()
            .delay(2)
            .duration(300)
            .style('r', function (o) {
              return o === d ? o.score * 40 : o.score * 40
            }).style('opacity', 1)
          labelNode
            .transition()
            .delay(5)
            .duration(300)
            .attr('display', 'block')
          link
            .transition()
            .delay(2)
            .duration(300)
            .style('opacity', 1)
        }

        function updateLink(link) {
          link.attr('x1', function (d) {
            return fixna(d.source.x)
          })
            .attr('y1', function (d) {
              return fixna(d.source.y)
            })
            .attr('x2', function (d) {
              return fixna(d.target.x)
            })
            .attr('y2', function (d) {
              return fixna(d.target.y)
            })
        }

        function updateNode(node) {
          node.attr('transform', function (d) {
            return 'translate(' + fixna(d.x) + ',' + fixna(d.y) + ')'
          })
        }

        function dragstarted(d) {
          d3.event.sourceEvent.stopPropagation()
          if (!d3.event.active) graphLayout.alphaTarget(0.3).restart()
          d.fx = d.x
          d.fy = d.y
        }

        function dragged(d) {
          d.fx = d3.event.x
          d.fy = d3.event.y
        }

        function dragended(d) {
          if (!d3.event.active) graphLayout.alphaTarget(0)
          d.fx = null
          d.fy = null
        }

        function collide(alpha) {
          let quadtree = d3.quadtree(graph.nodes);
          return function (d) {
            let radius = 400
            let padding = 400
            let rb = 2 * radius + padding,
              nx1 = d.x - rb,
              nx2 = d.x + rb,
              ny1 = d.y - rb,
              ny2 = d.y + rb;

            quadtree.visit(function (quad, x1, y1, x2, y2) {
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
