// composables/useDragAndDrop.js
import { ref, onMounted, onUnmounted } from 'vue'

export function useDragAndDrop() {
  const isDragging = ref(false)
  const draggedData = ref(null)
  const dragPreview = ref(null)
  const touchStartPos = ref({ x: 0, y: 0 })
  const currentTouchPos = ref({ x: 0, y: 0 })

  // Crear elemento de preview para mobile
  const createDragPreview = (element, data) => {
    const preview = document.createElement('div')
    preview.style.position = 'fixed'
    preview.style.pointerEvents = 'none'
    preview.style.zIndex = '9999'
    preview.style.transform = 'translate(-50%, -50%)'
    preview.style.opacity = '0.8'
    preview.style.borderRadius = '8px'
    preview.style.backgroundColor = 'white'
    preview.style.border = '2px solid #3b82f6'
    preview.style.padding = '8px'
    preview.style.boxShadow = '0 4px 8px rgba(0,0,0,0.2)'
    preview.style.width = '80px'
    preview.style.height = '80px'
    preview.style.display = 'flex'
    preview.style.alignItems = 'center'
    preview.style.justifyContent = 'center'
    preview.style.flexDirection = 'column'

    // Clonar la imagen
    const img = element.querySelector('img')
    if (img) {
      const clonedImg = img.cloneNode(true)
      clonedImg.style.width = '50px'
      clonedImg.style.height = '50px'
      clonedImg.style.objectFit = 'contain'
      preview.appendChild(clonedImg)
    }

    // Agregar texto
    const text = document.createElement('span')
    text.textContent = data.syllable
    text.style.fontSize = '12px'
    text.style.fontWeight = 'bold'
    text.style.color = '#1f2937'
    text.style.marginTop = '4px'
    preview.appendChild(text)

    document.body.appendChild(preview)
    return preview
  }

  // Actualizar posición del preview
  const updatePreviewPosition = (x, y) => {
    if (dragPreview.value) {
      dragPreview.value.style.left = `${x}px`
      dragPreview.value.style.top = `${y}px`
    }
  }

  // Encontrar elemento debajo del touch
  const getElementBelow = (x, y) => {
    if (dragPreview.value) {
      dragPreview.value.style.display = 'none'
    }
    const element = document.elementFromPoint(x, y)
    if (dragPreview.value) {
      dragPreview.value.style.display = 'flex'
    }
    return element
  }

  // Handlers para drag desktop
  const handleDragStart = (event, data) => {
    event.dataTransfer.setData('application/json', JSON.stringify(data))
    event.dataTransfer.effectAllowed = 'move'
    draggedData.value = data
    isDragging.value = true
  }

  const handleDragEnd = () => {
    isDragging.value = false
    draggedData.value = null
  }

  // Handlers para touch mobile
  const handleTouchStart = (event, element, data) => {
    event.preventDefault()
    const touch = event.touches[0]
    touchStartPos.value = { x: touch.clientX, y: touch.clientY }
    currentTouchPos.value = { x: touch.clientX, y: touch.clientY }
    draggedData.value = data
    
    // Crear preview después de un pequeño delay para distinguir de scroll
    setTimeout(() => {
      if (draggedData.value) {
        isDragging.value = true
        dragPreview.value = createDragPreview(element, data)
        updatePreviewPosition(touch.clientX, touch.clientY)
        
        // Agregar vibración en móviles si está disponible
        if (navigator.vibrate) {
          navigator.vibrate(50)
        }
      }
    }, 150)
  }

  const handleTouchMove = (event) => {
    if (!isDragging.value || !dragPreview.value) return
    
    event.preventDefault()
    const touch = event.touches[0]
    currentTouchPos.value = { x: touch.clientX, y: touch.clientY }
    updatePreviewPosition(touch.clientX, touch.clientY)
  }

  const handleTouchEnd = (event, onDrop) => {
    if (!isDragging.value) {
      draggedData.value = null
      return
    }
    
    event.preventDefault()
    const touch = event.changedTouches[0]
    const elementBelow = getElementBelow(touch.clientX, touch.clientY)
    
    // Buscar el drop zone más cercano
    let dropZone = elementBelow
    let attempts = 0
    while (dropZone && attempts < 10) {
      if (dropZone.dataset && dropZone.dataset.dropZone !== undefined) {
        break
      }
      dropZone = dropZone.parentElement
      attempts++
    }
    
    // Si encontramos un drop zone, ejecutar el drop
    if (dropZone && dropZone.dataset.dropZone !== undefined) {
      const position = parseInt(dropZone.dataset.dropZone)
      if (onDrop && typeof onDrop === 'function') {
        onDrop(draggedData.value, position)
      }
    }
    
    // Limpiar
    cleanupDrag()
  }

  const cleanupDrag = () => {
    if (dragPreview.value) {
      document.body.removeChild(dragPreview.value)
      dragPreview.value = null
    }
    isDragging.value = false
    draggedData.value = null
  }

  // Handlers para drop zones
  const handleDragOver = (event) => {
    event.preventDefault()
  }

  const handleDrop = (event, position, onDrop) => {
    event.preventDefault()
    try {
      const data = JSON.parse(event.dataTransfer.getData('application/json'))
      if (onDrop && typeof onDrop === 'function') {
        onDrop(data, position)
      }
    } catch (error) {
      console.error('Error processing drop:', error)
    }
  }

  // Cleanup en unmount
  onUnmounted(() => {
    cleanupDrag()
  })

  return {
    isDragging,
    draggedData,
    handleDragStart,
    handleDragEnd,
    handleTouchStart,
    handleTouchMove,
    handleTouchEnd,
    handleDragOver,
    handleDrop,
    cleanupDrag
  }
}