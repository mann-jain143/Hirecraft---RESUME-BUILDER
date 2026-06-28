import React, { useEffect, useRef } from 'react';

export default function PremiumAnimatedBackground() {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    let animationFrameId;
    const gl = canvas.getContext('webgl') || canvas.getContext('experimental-webgl');
    if (!gl) return;

    // Sync the WebGL drawing-buffer size with the CSS-driven layout size.
    function syncSize() {
      const rect = canvas.getBoundingClientRect();
      const w = rect.width || window.innerWidth;
      const h = rect.height || window.innerHeight;
      if (canvas.width !== w || canvas.height !== h) {
        canvas.width = w;
        canvas.height = h;
      }
    }
    
    // Trigger on resize
    const resizeObserver = new ResizeObserver(() => {
      syncSize();
    });
    resizeObserver.observe(canvas);
    syncSize();

    const vs = `
      attribute vec2 a_position;
      varying vec2 v_texCoord;
      void main() {
        v_texCoord = a_position * 0.5 + 0.5;
        gl_Position = vec4(a_position, 0.0, 1.0);
      }
    `;

    const fs = `
      precision highp float;
      uniform float u_time;
      uniform vec2 u_resolution;
      varying vec2 v_texCoord;

      float noise(vec2 p) {
          return fract(sin(dot(p, vec2(12.7, 78.2))) * 43758.5);
      }

      void main() {
          vec2 uv = v_texCoord;
          
          // Deep space colors from design system
          vec3 color1 = vec3(0.011, 0.0, 0.078); // #030014
          vec3 color2 = vec3(0.047, 0.039, 0.141); // #0C0A24
          vec3 color3 = vec3(0.388, 0.4, 0.945); // #6366F1 (Primary Accent)
          vec3 color4 = vec3(0.925, 0.282, 0.6); // #EC4899 (Secondary Accent)
          
          float n = noise(uv * 3.0 + u_time * 0.05);
          float glow = sin(uv.x * 1.5 + u_time * 0.5) * cos(uv.y * 1.5 + u_time * 0.3) * 0.5 + 0.5;
          
          // Flowing nebula effect
          vec3 finalColor = mix(color1, color2, uv.y + sin(u_time * 0.2) * 0.1);
          finalColor += color3 * glow * 0.18;
          finalColor += color4 * (1.0 - glow) * 0.07;
          
          // Distant stars
          float starIntensity = noise(uv * 150.0);
          if (starIntensity > 0.997) {
              float twinkle = sin(u_time * 3.0 + starIntensity * 100.0) * 0.5 + 0.5;
              finalColor += vec3(0.9, 0.9, 1.0) * twinkle * 0.8;
          }
          
          gl_FragColor = vec4(finalColor, 1.0);
      }
    `;

    function cs(type, src) {
      const s = gl.createShader(type);
      gl.shaderSource(s, src);
      gl.compileShader(s);
      if (!gl.getShaderParameter(s, gl.COMPILE_STATUS)) {
        console.error('Shader compilation failed:', gl.getShaderInfoLog(s));
      }
      return s;
    }

    const prog = gl.createProgram();
    gl.attachShader(prog, cs(gl.VERTEX_SHADER, vs));
    gl.attachShader(prog, cs(gl.FRAGMENT_SHADER, fs));
    gl.linkProgram(prog);
    if (!gl.getProgramParameter(prog, gl.LINK_STATUS)) {
      console.error('Program linking failed:', gl.getProgramInfoLog(prog));
      return;
    }
    gl.useProgram(prog);

    const buf = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, buf);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1,-1, 1,-1, -1,1, 1,1]), gl.STATIC_DRAW);
    const pos = gl.getAttribLocation(prog, 'a_position');
    gl.enableVertexAttribArray(pos);
    gl.vertexAttribPointer(pos, 2, gl.FLOAT, false, 0, 0);

    const uTime = gl.getUniformLocation(prog, 'u_time');
    const uRes = gl.getUniformLocation(prog, 'u_resolution');
    const uMouse = gl.getUniformLocation(prog, 'u_mouse');

    let mouse = { x: window.innerWidth / 2, y: window.innerHeight / 2 };

    const handleMouseMove = (event) => {
      const rect = canvas.getBoundingClientRect();
      if (rect.width && rect.height) {
        const nx = (event.clientX - rect.left) / rect.width;
        const ny = 1.0 - (event.clientY - rect.top) / rect.height;
        mouse.x = nx * canvas.width;
        mouse.y = ny * canvas.height;
      }
    };
    window.addEventListener('mousemove', handleMouseMove);

    function render(t) {
      gl.viewport(0, 0, canvas.width, canvas.height);
      if (uTime) gl.uniform1f(uTime, t * 0.001);
      if (uRes) gl.uniform2f(uRes, canvas.width, canvas.height);
      if (uMouse) gl.uniform2f(uMouse, mouse.x, mouse.y);
      gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);
      animationFrameId = requestAnimationFrame(render);
    }
    render(0);

    return () => {
      gl.deleteShader(gl.getAttachedShaders(prog)[0]);
      gl.deleteShader(gl.getAttachedShaders(prog)[1]);
      gl.deleteProgram(prog);
      gl.deleteBuffer(buf);
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener('mousemove', handleMouseMove);
      resizeObserver.disconnect();
    };
  }, []);

  return (
    <div className="fixed inset-0 z-0 overflow-hidden bg-slate-50 dark:bg-[#030014] transition-colors duration-500 pointer-events-none select-none">
      {/* Light mode background - fallback standard grid */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808006_1px,transparent_1px),linear-gradient(to_bottom,#80808006_1px,transparent_1px)] dark:hidden bg-[size:40px_40px] opacity-80" />
      
      {/* Dark mode WebGL canvas */}
      <canvas
        ref={canvasRef}
        className="hidden dark:block w-full h-full opacity-90"
        style={{ width: '100%', height: '100%' }}
      />
    </div>
  );
}
