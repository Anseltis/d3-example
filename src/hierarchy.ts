import * as d3 from 'd3';

import { Flare } from './dto/flare';

// Lazily construct the package hierarchy from class names.
export function packageHierarchy(classes: Flare[]): d3.HierarchyCircularNode<Flare> {
   var map = {};

   function find(name: any, data?: any): any {
       var node = map[name], i;
       if (!node) {
           node = map[name] = data || { name: name, children: [] };
           if (name.length) {
               node.parent = find(name.substring(0, i = name.lastIndexOf('.')));
               node.parent.children.push(node);
               node.key = name.substring(i + 1);
           }
       }
       return node;
   }

   classes.forEach(d => find(d.name, d));

   var result = d3.hierarchy(map['']) as d3.HierarchyCircularNode<Flare>;
   return result;
}

// Return a list of imports for the given array of nodes.
export function packageImports(nodes: d3.HierarchyNode<Flare>[]): d3.HierarchyLink<Flare>[] {
   var map: {[key: string]: d3.HierarchyNode<Flare>} = {},
   imports: d3.HierarchyLink<Flare>[] = [];

   // Compute a map from name to node.
   nodes.forEach(d => {
       map[d.data.name] = d;
   });

   // For each import, construct a link from the source to target node.
   nodes.forEach(d => {
       if (d.data.imports) {
           d.data.imports.forEach(i => {
               const path = <d3.HierarchyLink<Flare>><any>map[d.data.name].path(map[i]);
               imports.push(path);
           });
       }
   });

   return imports;
}