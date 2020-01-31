import babel from 'rollup-plugin-babel';
import resolve from 'rollup-plugin-node-resolve';
import commonjs from 'rollup-plugin-commonjs';

const pjson = require('./package.json');
const filename = pjson['jsnext:main'];

const banner = `/*!
 * ${pjson.name}
 * ${pjson.homepage}
 * @version ${pjson.version}
 * @license ${pjson.license} ${pjson.copyright}
 */`;

export default {
    input: pjson['jsnext:main'],
    treeshake: false, // this keeps rollup from removing un-used functions
    output: [
        {
            banner,
            file: `cjs/${filename}`,
            format: 'cjs',
            globals: {
                'c2-event-handler': 'c2EventHandler'
            },
            name: pjson['export']
        },
        {
            banner,
            file: `iife/${filename}`,
            format: 'iife',
            globals: {
                'c2-event-handler': 'c2EventHandler'
            },
            name: pjson['export']
        },
        {
            banner,
            file: `umd/${filename}`,
            format: 'umd',
            globals: {
                'c2-event-handler': 'c2EventHandler'
            },
            name: pjson['export'],
        }
    ],
    external: [ 'c2-event-handler' ],
    plugins: [
        babel(),
        resolve(),
        commonjs()
    ]
};
