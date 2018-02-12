import { json as d3json } from 'd3-fetch';

import { Flare } from './dto/flare';
import { Relation } from './dto/relation';

export async function load() : Promise<Flare[]> {
    //const flares = await d3json<Flare[]>('asset/flare.json');
   const relations = await d3json<Relation[]>('asset/out.json');

   const sr = relations.map(r => ({
           from: `${r.From.ClassName.trimRight()}.${r.From.MethodName}`,
           to: `${r.To.ClassName.trimRight()}.${r.To.MethodName}`
       }));

   const uniq = Array.from(new Set([
       ...sr.map(r => r.from),
       ...sr.map(r => r.to)
   ]));
   const flares = uniq.map(r => {
       const items = sr.filter(rr => r === rr.from).map(rr => rr.to);
       const imports = Array.from(new Set(items));
       return <Flare>{
           name: r,
           size: items.length,
           imports: imports
       };
   });

   console.log(flares);
   return Promise.resolve(flares);
}