        function showPage(pageName) {
            // Ocultar todas las páginas
            const pages = document.querySelectorAll('.page');
            pages.forEach(page => {
                page.style.display = 'none';
            });

            // Mostrar la página seleccionada
            document.getElementById(pageName).style.display = 'block';

            // Si es la página de cotización, cargar productos
            if (pageName === 'cotizacion') {
                cargarProductosCotizacion();
            }
        }

        /* ===========================================
           FUNCIÓN 2: Carousel (Carrusel de imágenes)
           =========================================== */
        let currentSlide = 0;
        const slides = document.querySelectorAll('#carouselImages img');
        const totalSlides = slides.length;

        // Crear indicadores del carousel
        function createIndicators() {
            const indicatorsContainer = document.getElementById('carouselIndicators');
            for (let i = 0; i < totalSlides; i++) {
                const indicator = document.createElement('div');
                indicator.className = 'indicator';
                if (i === 0) indicator.classList.add('active');
                indicator.onclick = () => goToSlide(i);
                indicatorsContainer.appendChild(indicator);
            }
        }

        // Mover el carousel
        function moveCarousel(direction) {
            currentSlide += direction;
            
            // Volver al inicio o al final si es necesario
            if (currentSlide < 0) {
                currentSlide = totalSlides - 1;
            } else if (currentSlide >= totalSlides) {
                currentSlide = 0;
            }
            
            updateCarousel();
        }

        // Ir a una diapositiva específica
        function goToSlide(index) {
            currentSlide = index;
            updateCarousel();
        }

        // Actualizar la posición del carousel
        function updateCarousel() {
            const carouselImages = document.getElementById('carouselImages');
            carouselImages.style.transform = `translateX(-${currentSlide * 100}%)`;
            
            // Actualizar indicadores
            const indicators = document.querySelectorAll('.indicator');
            indicators.forEach((indicator, index) => {
                if (index === currentSlide) {
                    indicator.classList.add('active');
                } else {
                    indicator.classList.remove('active');
                }
            });
        }

        // Carousel automático (cambia cada 5 segundos)
        function autoPlayCarousel() {
            setInterval(() => {
                moveCarousel(1);
            }, 5000); // 5000 milisegundos = 5 segundos
        }

        /* ===========================================
           FUNCIÓN 3: Sistema de Cotización
           PERSONALIZABLE: Añade tus productos aquí
           =========================================== */
        
        // Lista de productos (PERSONALIZABLE)
        const productosDisponibles = [
            { codigo: 'PROD-001', nombre: 'Tazas personalizadas', precio: 15.00 },
            { codigo: 'PROD-002', nombre: 'Regalos sorpresas', precio: 35.00},
            { codigo: 'PROD-003', nombre: 'Cartas de amor', precio: 10.00 },
            { codigo: 'PROD-004', nombre: 'Oso de felpa', precio: 25.00 }
        ];
        

        // Cargar productos en el formulario de cotización
        
        function cargarProductosCotizacion() {
            
            const container = document.getElementById('productosSeleccion');
            if (!container) return;
            container.innerHTML = '';
        
            productosDisponibles.forEach((producto, index) => {
                const row = document.createElement('div');
                row.className = 'product-row';
                row.style.gridTemplateColumns = '1fr 2fr 1fr 1fr'; // agrega columna para imagen
                row.innerHTML = `
                    <div class="form-group" style="margin:0;">
                        <img src="imagenes/producto${index + 1}.jpg" 
                             alt="${producto.nombre}" 
                             style="width:100px;height:80px;object-fit:cover;border-radius:6px;"
                             onerror="this.src='https://via.placeholder.com/100x80/cccccc/000000?text=Producto'">
                    </div>
        
                    <div class="form-group" style="margin:0;">
                        <label>${producto.nombre} (${producto.codigo})</label>
                        <p style="color:var(--color-acento);font-weight:bold;margin-top:5px;">$${producto.precio.toFixed(2)}</p>
                    </div>
        
                    <div class="form-group" style="margin:0;">
                        <label>Cantidad:</label>
                        <input type="number" id="cantidad-${index}" min="0" value="0"
                               oninput="calcularTotal()" style="padding:8px;">
                    </div>
        
                    <div class="form-group" style="margin:0;">
                        <label>Subtotal:</label>
                        <p id="subtotal-${index}" 
                           style="font-weight:bold;color:var(--color-principal);margin-top:8px;">$0.00</p>
                    </div>
                `;
                container.appendChild(row);
            });
            calcularTotal();
        }
        
        // Calcular el total de la cotización
        function calcularTotal() {
            let total = 0;
        
            productosDisponibles.forEach((producto, index) => {
                const cantidadInput = document.getElementById(`cantidad-${index}`);
                if (!cantidadInput) return;
        
                const cantidad = parseInt(cantidadInput.value) || 0;
                const subtotal = cantidad * producto.precio;
        
                // Actualizar subtotal con formato
                const subtotalEl = document.getElementById(`subtotal-${index}`);
                if (subtotalEl) subtotalEl.textContent = `$${subtotal.toFixed(2)}`;
        
                total += subtotal;
            });
        
            // Mostrar el total
            const totalEl = document.getElementById('totalPedido');
            if (totalEl) totalEl.textContent = `$${total.toFixed(2)}`;
        }

        // Generar cotización (mostrar resumen)
        function generarCotizacion() {
            const nombre = document.getElementById('nombreCliente').value;
            const email = document.getElementById('emailCliente').value;

            // Validar que se haya ingresado nombre y email
            if (!nombre || !email) {
                alert('Por favor, ingresa tu nombre y email antes de generar la cotización.');
                return;
            }

            // Recopilar productos seleccionados
            let productosSeleccionados = [];
            let total = 0;

            productosDisponibles.forEach((producto, index) => {
                const cantidad = parseInt(document.getElementById(`cantidad-${index}`).value) || 0;
                if (cantidad > 0) {
                    const subtotal = cantidad * producto.precio;
                    productosSeleccionados.push({
                        nombre: producto.nombre,
                        codigo: producto.codigo,
                        cantidad: cantidad,
                        precioUnitario: producto.precio,
                        subtotal: subtotal
                    });
                    total += subtotal;
                }
            });

            // Validar que se haya seleccionado al menos un producto
            if (productosSeleccionados.length === 0) {
                alert('Por favor, selecciona al menos un producto con cantidad mayor a 0.');
                return;
            }

            // Crear mensaje de cotización
            let mensaje = `COTIZACIÓN GENERADA\n\n`;
            mensaje += `Cliente: ${nombre}\n`;
            mensaje += `Email: ${email}\n`;
            mensaje += `Fecha: ${new Date().toLocaleDateString()}\n\n`;
            mensaje += `PRODUCTOS SELECCIONADOS:\n`;
            mensaje += `${'='.repeat(50)}\n`;

            mensaje += `Producto (codigo) - Cant - Subtotal - Total\n`;

            productosSeleccionados.forEach(prod => {
                mensaje += `\n${prod.nombre} (${prod.codigo}) -`;
                mensaje += `  ${prod.cantidad} -`;
                mensaje += `  ${prod.precioUnitario.toFixed(2)}-`;
                mensaje += `  ${prod.subtotal.toFixed(2)}\n`;
            });

            mensaje += `\n${'='.repeat(50)}\n`;
            mensaje += `TOTAL: ${total.toFixed(2)}\n\n`;
            mensaje += `Gracias por tu preferencia!`;

            // Mostrar cotización
            alert(mensaje);
        }

        /* ===========================================
           FUNCIÓN 4: Inicialización
           Se ejecuta cuando la página carga
           =========================================== */
        
        // Ejecutar cuando el documento esté listo
        document.addEventListener('DOMContentLoaded', function() {
            // Inicializar carousel
            createIndicators();
            autoPlayCarousel();
            
            // Mostrar página de inicio por defecto
            showPage('inicio');
        });