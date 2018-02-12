import * as d3 from 'd3';

import { Coordinate } from './dto/coordinate';
import { Flare } from './dto/flare';
import { packageHierarchy, packageImports } from './hierarchy';
import { load } from './load';

import './style.css';

const mouseovered = (nodes, links) => d => {
   nodes
       .each(node => {
           node.target = false;
           node.source = false;
       });

   links
       .classed('link--target', link => {
           if (link.target === d) {
               return link.source.source = true;
           }
       })
       .classed('link--source', link => {
           if (link.source === d) {
               return link.target.target = true;
           }
       })
       .filter(link => link.target === d || link.source === d)
       .raise();

   nodes
       .classed('node--target', node => node.target)
       .classed('node--source', node => node.source);
};

const mouseouted = (node, link) => d => {
   link
       .classed('link--target', false)
       .classed('link--source', false);

   node
       .classed('node--target', false)
       .classed('node--source', false);
};

async function init(): Promise<void> {
   const diameter = 960;
   const radius = diameter / 2;
   const innerRadius = radius - 120;

   const cluster = d3.cluster()
       .size([360, innerRadius]);

   const line = d3.radialLine<Coordinate>()
       .curve(d3.curveBundle.beta(0.85))
       .radius(d => d.y)
       .angle(d => d.x / 180 * Math.PI);

   const  svg = d3.select('body').append('svg')
       .attr('width', diameter)
       .attr('height', diameter)
       .append('g')
       .attr('transform', `translate(${radius},${radius})`);

   const link = svg.append('g').selectAll('.link');
   const node = svg.append('g').selectAll('.node');

  const flares = await load();
  const root = packageHierarchy(flares)
       .sum(d => d.size);

   cluster(root);

   link
       .data(packageImports(root.leaves()))
       .enter().append('path')
       .each(d => {
           d.source = d[0];
           d.target = d[(d as any).length - 1];
       })
       .attr('class', 'link')
       .attr('d', <any>line);

   node
       .data(root.leaves()).enter().append('text')
       .attr('class', 'node')
       .attr('dy', '0.31em')
       .attr('transform', d => `rotate(${d.x - 90})translate(${d.y + 8},0)${d.x < 180 ? '' : 'rotate(180)'}`)
       .attr('text-anchor', d => d.x < 180 ? 'start' : 'end')
       .text(d => (d.data as any).key)
       .on('mouseover', mouseovered(node, link))
       .on('mouseout', mouseouted(node, link));
}

init();