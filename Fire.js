import {
  Color,
  Mesh,
  ShaderMaterial,
  UniformsLib,
  UniformsUtils,
  Vector3,
} from 'three';

var Fire = function (geometry, options) {
  options = options || {};

  var textureWidth = options.textureWidth !== undefined ? options.textureWidth : 128;
  var textureHeight = options.textureHeight !== undefined ? options.textureHeight : 128;
  var debug = options.debug !== undefined ? options.debug : false;

  var material = new ShaderMaterial({
    defines: {
      'ITERATIONS': '20',
      'NUM_OCTAVES': '3'
    },

    uniforms: UniformsUtils.merge([
      UniformsLib.common,
      UniformsLib.fog,
      UniformsLib.lights,
      {
        'time': { value: 0 },
        'scale': { value: new Vector3(1, 1, 1) },
        'seed': { value: 0.02 },
        'color1': { value: new Color(0xffffff) },
        'color2': { value: new Color(0xffffff) },
        'noiseTexture': { value: null },
        'distortionMap': { value: null },
        'tDiffuse': { value: null },
        'tDiffuseBlur': { value: null }
      }
    ]),

    vertexShader: /* glsl */`
      varying vec3 vWorldPosition;
      varying vec3 vNormal;

      void main() {
        vNormal = normalize(normalMatrix * normal);
        vec4 worldPosition = modelMatrix * vec4(position, 1.0);
        vWorldPosition = worldPosition.xyz;
        gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
      }
    `,

    fragmentShader: /* glsl */`
      #include <common>
      #include <fog_pars_fragment>
      #include <bsdfs>
      #include <lights_pars_begin>
      #include <lights_phong_pars_fragment>
      #include <shadowmap_pars_fragment>
      #include <logdepthbuf_pars_fragment>
      #include <clipping_planes_pars_fragment>

      uniform float time;
      uniform vec3 scale;
      uniform float seed;
      uniform vec3 color1;
      uniform vec3 color2;
      uniform sampler2D noiseTexture;
      uniform sampler2D distortionMap;
      uniform sampler2D tDiffuse;
      uniform sampler2D tDiffuseBlur;

      varying vec3 vWorldPosition;
      varying vec3 vNormal;

      float rand(vec2 co) {
        return fract(sin(dot(co.xy, vec2(12.9898, 78.233))) * 43758.5453);
      }

      float noise(vec3 p) {
        vec3 i = floor(p);
        vec3 f = fract(p);
        vec3 u = f * f * (3.0 - 2.0 * f);
        return mix(mix(mix(rand(i + vec3(0.0, 0.0, 0.0)), rand(i + vec3(1.0, 0.0, 0.0)), u.x),
                      mix(rand(i + vec3(0.0, 1.0, 0.0)), rand(i + vec3(1.0, 1.0, 0.0)), u.x), u.y),
                   mix(mix(rand(i + vec3(0.0, 0.0, 1.0)), rand(i + vec3(1.0, 0.0, 1.0)), u.x),
                      mix(rand(i + vec3(0.0, 1.0, 1.0)), rand(i + vec3(1.1, 1.0, 1.0)), u.x), u.y), u.z);
      }

      float fbm(vec3 p) {
        float value = 0.0;
        float amplitude = 0.5;
        vec3 shift = vec3(100.0);
        float frequency = 0.0;
        for (int i = 0; i < NUM_OCTAVES; i++) {
          value += amplitude * noise(p);
          p = p * 2.0 + shift;
          amplitude *= 0.5;
        }
        return value;
      }

      void main() {
        #include <clipping_planes_fragment>
        vec2 uv = gl_FragCoord.xy / resolution.xy;
        vec4 noiseColor = texture2D(noiseTexture, uv);
        vec3 color = vec3(0.0);
        for (int i = 0; i < ITERATIONS; i++) {
          color += fbm(vWorldPosition * scale + time * 0.05 + float(i) * seed);
        }
        color = mix(color1, color2, color / float(ITERATIONS));
        vec4 fireColor = vec4(color, 1.0);
        vec4 finalColor = mix(fireColor, texture2D(tDiffuse, uv), texture2D(tDiffuseBlur, uv).r);
        gl_FragColor = finalColor;
      }
    `,

    lights: true,
    fog: true,
    transparent: true,
    depthWrite: false
  });

  this.fireMesh = new Mesh(geometry, material);
  this.add(this.fireMesh);

  var debugMaterial = new ShaderMaterial({
    uniforms: UniformsUtils.merge([
      UniformsLib.common,
      UniformsLib.fog,
      UniformsLib.lights,
      {
        'time': { value: 0 },
        'scale': { value: new Vector3(1, 1, 1) },
        'seed': { value: 0.02 },
        'color1': { value: new Color(0xffffff) },
        'color2': { value: new Color(0xffffff) },
        'noiseTexture': { value: null },
        'distortionMap': { value: null },
        'tDiffuse': { value: null },
        'tDiffuseBlur': { value: null }
      }
    ]),

    vertexShader: material.vertexShader,
    fragmentShader: /* glsl */`
      #include <common>
      #include <fog_pars_fragment>
      #include <bsdfs>
      #include <lights_pars_begin>
      #include <lights_phong_pars_fragment>
      #include <shadowmap_pars_fragment>
      #include <logdepthbuf_pars_fragment>
      #include <clipping_planes_pars_fragment>

      uniform float time;
      uniform vec3 scale;
      uniform float seed;
      uniform vec3 color1;
      uniform vec3 color2;
      uniform sampler2D noiseTexture;
      uniform sampler2D distortionMap;
      uniform sampler2D tDiffuse;
      uniform sampler2D tDiffuseBlur;

      varying vec3 vWorldPosition;
      varying vec3 vNormal;

      void main() {
        #include <clipping_planes_fragment>
        vec2 uv = gl_FragCoord.xy / resolution.xy;
        vec4 noiseColor = texture2D(noiseTexture, uv);
        vec3 color = vec3(0.0);
        for (int i = 0; i < ITERATIONS; i++) {
          color += fbm(vWorldPosition * scale + time * 0.05 + float(i) * seed);
        }
        color = mix(color1, color2, color / float(ITERATIONS));
        vec4 fireColor = vec4(color, 1.0);
        vec4 finalColor = mix(fireColor, texture2D(tDiffuse, uv), texture2D(tDiffuseBlur, uv).r);
        gl_FragColor = finalColor;
      }
    `,

    lights: true,
    fog: true,
    transparent: true,
    depthWrite: false
  });

  if (debug === true) {
    var plane = new Mesh(geometry, debugMaterial);
    this.add(plane);
  }
};

Fire.prototype = Object.assign(Object.create(Mesh.prototype), {
  constructor: Fire,

  render: function (renderer, writeBuffer, readBuffer, deltaTime, maskActive) {
    this.uniforms['time'].value += deltaTime * 0.5;
    renderer.setRenderTarget(this.renderToScreen ? null : writeBuffer);
    renderer.clear();
    renderer.render(this.scene, this.camera);
  }
});

export { Fire };
