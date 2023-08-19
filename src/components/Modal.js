import React, { useState, useRef, useEffect } from 'react';
import './Modal.css';
import ACTIONS from '../constants/Actions';
const Modal = ({ modalOpen, setmodalOpen, socketRef, roomId }) => {
  const canvasRef = useRef(null);
  const [context, setContext] = useState(null);
  const [drawing, setDrawing] = useState(false);
  const [pencil, setPencil] = useState(true);
  const [clearCanvas, setClearCanvas] = useState(false);
  const [penColor, setPenColor] = useState('#000000');
  useEffect(() => {
    if (socketRef.current) {
      socketRef.current.emit(ACTIONS.WHITE_BOARD_SETTINGS, {
        roomId: roomId,
        pencil: pencil,
        eraser: !pencil,
      });
    }
  }, [socketRef.current, roomId, pencil, drawing]);

  useEffect(() => {
    if (canvasRef.current) {
      const canvas = canvasRef.current;
      const ctx = canvas.getContext('2d');
      setContext(ctx);
    }
  }, []);

  useEffect(() => {
    if (context) {
      context.strokeStyle = pencil ? penColor : '#ffffff';
      context.lineWidth = 2;
      context.lineCap = 'round';
    }
  }, [context, pencil,penColor]);

  const handleMouseDown = (e) => {
    setDrawing(true);
    const x = e.nativeEvent.offsetX;
    const y = e.nativeEvent.offsetY;
    context.beginPath();
    context.moveTo(x, y);

    if (socketRef.current) {
      socketRef.current.emit(ACTIONS.DRAW_START, { roomId: roomId, x, y });
    }
  };

  const handleMouseMove = (e) => {
    if (!drawing) return;
    const x = e.nativeEvent.offsetX;
    const y = e.nativeEvent.offsetY;
    context.lineTo(x, y);
    context.stroke();

    if (socketRef.current) {
      socketRef.current.emit(ACTIONS.DRAW_MOVE, { roomId: roomId, x, y });
    }
  };

  const handleMouseUp = () => {
    if (drawing) {
      context.closePath();
      setDrawing(false);
      setClearCanvas(false);
      if (socketRef.current) {
        socketRef.current.emit(ACTIONS.DRAW_END, { roomId: roomId });
      }
    }
  };

  const handlePencilEraserToggle = () => {
    setPencil((prevPencil) => !prevPencil);
  };
  const handleColorChange = (e) => {
    const newColor = e.target.value;
    setPenColor(newColor);
console.log(newColor);
    if (socketRef.current) {
      socketRef.current.emit(ACTIONS.PEN_COLOR_CHANGE, { roomId, color: newColor });
    }
  };
  const handleCanvasReset = () => {
    context.clearRect(0, 0, canvasRef.current.width, canvasRef.current.height);
    if (socketRef.current) {
      socketRef.current.emit(ACTIONS.CLEAR_CANVAS, { roomId: roomId });
    }
  };
  
  const clearDrawingHistory = () => {
    context.clearRect(0, 0, canvasRef.current.width, canvasRef.current.height);
  };
  
  const handleClose = () => {
    setmodalOpen(false);
    socketRef.current.emit(ACTIONS.CLOSE_WHITE_BOARD, { modalOpen, roomId });
  };

  useEffect(() => {
    if (socketRef.current) {
      socketRef.current.on(ACTIONS.WHITE_BOARD_OPENED, ({ modalOpen, roomId }) => {
        if (roomId === roomId) {
          setmodalOpen(modalOpen);
        }
      });
    }
    return () => {
      if (socketRef.current) {
        socketRef.current.off(ACTIONS.WHITE_BOARD_OPENED);
      }
    };
  }, [socketRef.current, modalOpen]);
     useEffect(() => {
      if (canvasRef.current) {
        const canvas = canvasRef.current;
        const ctx = canvas.getContext('2d');
        console.log('ctx',ctx);
        setContext(ctx);
        if (socketRef.current) {
          socketRef.current.on(ACTIONS.WHITE_BOARD_SETTINGS, ({ roomId, pencil }) => {
            // Update the pencil state based on the received value
            if (roomId === roomId && context) {
            setPencil(pencil);
            }
          });
        }
        if (socketRef.current) {
          socketRef.current.on(ACTIONS.DRAW_START, ({ roomId, x, y }) => {
            if (roomId === roomId && context) {
              console.log('moved');
              context.beginPath();
              context.moveTo(x, y);
            }
          });
    
          socketRef.current.on(ACTIONS.DRAW_MOVE, ({ roomId, x, y }) => {
            if (roomId === roomId && drawing && context) {
              context.lineTo(x, y);
              context.stroke();
            }
          });
    
          socketRef.current.on(ACTIONS.DRAW_END, ({ roomId }) => {
            if (roomId === roomId && drawing && context) {
              context.closePath();
              setDrawing(false);
            }
          });
          socketRef.current.on(ACTIONS.PEN_COLOR_CHANGE, ({ roomId, color }) => {
            if (roomId === roomId) {
              setPenColor(color);
            }
          });
          socketRef.current.on(ACTIONS.CLEAR_CANVAS, ({ roomId }) => {
            if (roomId === roomId && context && drawing && canvasRef.current) {
              clearDrawingHistory();
              context.clearRect(0, 0, canvasRef.current.width, canvasRef.current.height);
            }
          });
        }
      }
    }, [canvasRef.current, context, drawing, penColor,roomId, socketRef.current]);

  return (
    <div className={`modalBackground active`}>
      <div className={`modalContainer active`}>
        <button className="closeButton" onClick={handleClose}>
          Close
        </button>
        <canvas
            ref={canvasRef}
            onMouseDown={handleMouseDown}
            onMouseMove={handleMouseMove}
            onMouseUp={handleMouseUp}
            width={'900px'}
            height={'400px'}
          />
        <div className="canvasContainer">
        <div className="colorPicker">
          <label htmlFor="color">Pen Color: </label>
          <input
            type="color"
            id="color"
            value={penColor}
            onChange={handleColorChange}
          />
        </div>
        <div className='btn-actions'>
        <button className="resetButton" onClick={handleCanvasReset}>
         Reset
        </button>
        </div>
        <div className='pencil-eraser'>
        <button
          className={`modeButton ${pencil ? 'pencilMode' : 'eraserMode'}`}
          onClick={handlePencilEraserToggle}
        >
          {pencil ? (
            <>
              <span className="pencilIcon"></span> Pencil
            </>
          ) : (
            <>
              <span className="eraserIcon"></span> Eraser
            </>
          )}
        </button>
        </div>
        </div>
      </div>
    </div>
  );
};

export default Modal;
