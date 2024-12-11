/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useEffect, useRef, useState } from 'react';
import { Link as JssLink, ImageField, Field, LinkField } from '@sitecore-jss/sitecore-jss-nextjs';

interface Fields {
  PromoIcon: ImageField;
  PromoText: Field<string>;
  PromoLink: LinkField;
  PromoText2: Field<string>;
}

interface RenderingParams {
  align: 'flex-start' | 'center' | 'flex-end';
  backgroundColor: string;
  color: string;
  margins: number;
  paddings: number;
  layout: 'horizontal' | 'vertical';
  width: number;
  imageUrl?: string;
}

type CustomComponentProps = {
  params: { [key: string]: string };
  rendering: { uid: string };
  fields: Fields;
};

declare global {
  interface Window {
    pagesSetRenderingParams?: (renderingInstanceId: string, params: string) => void;
  }
}

export const Default = (props: CustomComponentProps): JSX.Element => {
  let paramsObj: RenderingParams | undefined = undefined;
  const id = props.rendering.uid;
  const dragStart = { clientX: 0, clientY: 0 };

  if (props.params?.extKey) {
    paramsObj = JSON.parse(props.params.extKey) as RenderingParams;
  }
  const _align = paramsObj?.align ?? 'center';
  const _color = paramsObj?.color ?? '#ffffff';
  const _backgroundColor = paramsObj?.backgroundColor ?? '#1d08bd';
  const _margins = paramsObj?.margins ?? 0;
  const _paddings = paramsObj?.paddings ?? 20;
  const _layout = paramsObj?.layout ?? 'horizontal';
  const _width = paramsObj?.width ?? 800;

  const [isEditMode, setIsEditMode] = useState(false);
  const [popoverVisible, setPopoverVisible] = useState(false);
  const [alignment, setAlignment] = useState<'flex-start' | 'center' | 'flex-end'>(_align);
  const [color, setColor] = useState<string>(_color);
  const [backgroundColor, setBackgroundColor] = useState<string>(_backgroundColor);
  const [margins, setMargins] = useState<number>(_margins);
  const [paddings, setPaddings] = useState<number>(_paddings);
  const [layout, setLayout] = useState<'horizontal' | 'vertical'>(_layout);
  const [width, setWidth] = useState<number>(_width);
  const [allowDrag, setAllowDrag] = useState(true);

  const popoverRef = useRef<HTMLDivElement | null>(null);

  let isEditModeObtained = false;
  const checkIsEditMode = () => {
    if (
      (typeof window !== 'undefined' && window.pagesSetRenderingParams) ||
      (typeof document !== 'undefined' &&
        document?.querySelector('code[type="text/sitecore"][chrometype="rendering"]'))
    ) {
      clearInterval(interval);
      isEditModeObtained = true;
      setIsEditMode(true);
    }
  };
  const interval = setInterval(checkIsEditMode, 200);
  setTimeout(() => isEditModeObtained || clearInterval(interval), 3000);

  const handleAlignmentChange = (align: 'flex-start' | 'center' | 'flex-end') => {
    const parameters: RenderingParams = {
      align,
      backgroundColor,
      color,
      width,
      margins,
      paddings,
      layout,
    };
    if (typeof window !== 'undefined') {
      window.pagesSetRenderingParams?.(id, JSON.stringify(parameters));
    }
    setAlignment(align);
  };

  const handleBackgroundColorChange = (newColor: string) => {
    const parameters: RenderingParams = {
      align: alignment,
      backgroundColor: newColor,
      color,
      width,
      margins,
      paddings,
      layout,
    };
    if (typeof window !== 'undefined') {
      window.pagesSetRenderingParams?.(id, JSON.stringify(parameters));
    }
    setBackgroundColor(newColor);
  };

  const handleColorChange = (newColor: string) => {
    const parameters: RenderingParams = {
      align: alignment,
      backgroundColor,
      color: newColor,
      width,
      margins,
      paddings,
      layout,
    };
    if (typeof window !== 'undefined') {
      window.pagesSetRenderingParams?.(id, JSON.stringify(parameters));
    }
    setColor(newColor);
  };

  const handleWidthChange = (value: string | undefined) => {
    const newWidth = parseInt(value || '800', 10) ?? 800;

    const parameters: RenderingParams = {
      align: alignment,
      backgroundColor,
      color,
      width: newWidth,
      margins,
      paddings,
      layout,
    };

    if (typeof window !== 'undefined') {
      window.pagesSetRenderingParams?.(id, JSON.stringify(parameters));
    }

    setWidth(newWidth);
  };

  const handleMarginsChange = (value: string | undefined) => {
    const newMargin: number = parseInt(value ?? '0', 10) || 0;

    const parameters: RenderingParams = {
      align: alignment,
      backgroundColor,
      color,
      width,
      margins: newMargin,
      paddings,
      layout,
    };

    if (typeof window !== 'undefined') {
      window.pagesSetRenderingParams?.(id, JSON.stringify(parameters));
    }

    setMargins(newMargin);
  };
  const handlePaddingsChange = (value: string | undefined) => {
    const newPadding: number = parseInt(value ?? '0', 10) || 0;

    const parameters: RenderingParams = {
      align: alignment,
      backgroundColor,
      color,
      width,
      margins,
      paddings: newPadding,
      layout,
    };

    if (typeof window !== 'undefined') {
      window.pagesSetRenderingParams?.(id, JSON.stringify(parameters));
    }

    setPaddings(newPadding);
  };
  const handleLayoutChange = (value: string | undefined) => {
    const newLayout: 'horizontal' | 'vertical' = value === 'vertical' ? 'vertical' : 'horizontal';

    const parameters: RenderingParams = {
      align: alignment,
      backgroundColor,
      color,
      width,
      margins,
      paddings,
      layout: newLayout,
    };

    if (typeof window !== 'undefined') {
      window.pagesSetRenderingParams?.(id, JSON.stringify(parameters));
    }

    setLayout(newLayout);
  };

  const handleReset = () => {
    const parameters: RenderingParams = {
      align: 'center',
      backgroundColor: '#1d08bd',
      width: 800,
      color: '#ffffff',
      margins: 0,
      paddings: 20,
      layout: 'horizontal',
    };
    if (typeof window !== 'undefined') {
      window.pagesSetRenderingParams?.(id, JSON.stringify(parameters));
    }

    setAlignment('center');
    setBackgroundColor('#1d08bd');
    setColor('#ffffff');
    setWidth(800);
    setMargins(0);
    setPaddings(20);
    setLayout('horizontal');
  };

  const handleBlur = (e: React.FocusEvent<HTMLDivElement>) => {
    if (popoverRef.current && !popoverRef.current.contains(e.relatedTarget)) {
      setPopoverVisible(false);
    }
  };

  const initDragCatchingOverlay = () => {
    const dragOverlay = document.createElement('div');
    dragOverlay.style.width = '100%';
    dragOverlay.style.height = '100%';
    dragOverlay.style.position = 'absolute';
    dragOverlay.style.zIndex = '99999999998';
    document.body.insertBefore(dragOverlay, document.body.firstChild);

    popoverRef.current?.addEventListener('dragend', () => {
      dragOverlay?.remove();
    });
  };

  useEffect(() => {
    if (popoverVisible && popoverRef.current) {
      popoverRef.current.focus(); // Focus the popover when it becomes visible
    }
  }, [popoverVisible]);

  return (
    <div className={`component custom-component ${props.params.styles}`} tabIndex={0}>
      {/* Button to toggle popover */}
      {isEditMode && (
        <button onClick={() => setPopoverVisible(true)} className="btn edit-btn">
          <span className="mdi mdi-pencil-outline"></span>
        </button>
      )}

      <div
        className={`component rich-promo ${props.params.styles}`}
        id={id ? id : undefined}
        style={{
          justifyContent: alignment,
        }}
      >
        <div className="component-content">
          <div
            className={`the-link ${layout === 'vertical' ? 'vertical' : ''}`}
            style={{
              background: `linear-gradient(-45deg, ${backgroundColor}, #CC0017, ${backgroundColor}, #EB001A)`,
              gap: paddings + 'px',
              padding: paddings + 'px',
              marginBlock: margins + 'px',
              width: layout === 'horizontal' ? 'auto' : width + 'px',
            }}
          >
            <span
              className="rich-promo__date"
              style={{
                color: color,
              }}
            >
              October 15-18 in Nashville | Learn, connect, and stay ahead at Sitecore’s biggest
              event of the year
            </span>
            <span className="rich-promo__cta">
              <JssLink field={props.fields.PromoLink} />
            </span>
          </div>

          {!!props?.params?.imageUrl && (
            <div
              style={{
                display: 'flex',
                justifyContent: 'center',
              }}
            >
              <img
                style={{ maxWidth: '400px', margin: '40px auto' }}
                src={props.params.imageUrl}
                alt=""
              />
            </div>
          )}
        </div>
      </div>

      {/* Popover Element */}
      {popoverVisible && (
        <div
          draggable={allowDrag}
          onBlur={handleBlur}
          ref={popoverRef}
          className="popover"
          tabIndex={0}
          onDragStart={(e) => {
            (dragStart.clientX = e.clientX - e.currentTarget.offsetLeft),
              (dragStart.clientY = e.clientY - e.currentTarget.offsetTop);

            const transparentImg = new Image();
            transparentImg.src =
              'data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7';
            e.dataTransfer.setDragImage(transparentImg, 0, 0);

            initDragCatchingOverlay();
          }}
          onDrag={(e) => {
            if (e.clientX <= 0 || e.clientY <= 0) {
              return;
            }

            e.preventDefault();
            popoverRef.current!.style.left = `${e.clientX - dragStart.clientX}px`;
            popoverRef.current!.style.top = `${e.clientY - dragStart.clientY}px`;
          }}
        >
          <div className="mb-5 overflow-hidden">
            <h3 className=" float-start fs-4 fw-bold mt-2">Configure</h3>
            <button onClick={() => setPopoverVisible(false)} className="btn border-0 float-end">
              <span className="mdi mdi-close"></span>
            </button>
          </div>

          <div className="row mb-5">
            <div className="col">
              <p>Gradient color</p>
              <div className="overflow-hidden">
                <input
                  type="color"
                  className="form-control form-control-lg form-control-color border-0 float-start"
                  style={{ width: '4rem' }}
                  value={backgroundColor}
                  onChange={(e) => handleBackgroundColorChange(e.target.value)}
                />
                <span className="text-uppercase d-inline-block ms-3 mt-1">{backgroundColor}</span>
              </div>
            </div>
            <div className="col">
              <p>Text color</p>
              <div className="overflow-hidden">
                <input
                  type="color"
                  className="form-control form-control-lg form-control-color border-0 float-start"
                  style={{ width: '4rem' }}
                  value={color}
                  onChange={(e) => handleColorChange(e.target.value)}
                />
                <span className="text-uppercase d-inline-block ms-3 mt-1">{color}</span>
              </div>
            </div>
          </div>

          <div className="mb-5 row">
            <div className="col">
              <p>Layout</p>
              <div>
                <div className="radio-tab">
                  <div className="form-check form-check-inline">
                    <input
                      className="form-check-input"
                      type="radio"
                      name="flexRadioDefault"
                      id="flexRadioDefault1"
                      value="horizontal"
                      checked={layout === 'horizontal'}
                      onChange={(e) => handleLayoutChange(e.target.value)}
                    />
                    <label className="form-check-label" htmlFor="flexRadioDefault1">
                      <span className="mdi mdi-arrow-right mdi-24px"></span>
                    </label>
                  </div>
                  <div className="form-check form-check-inline ms-2">
                    <input
                      className="form-check-input"
                      type="radio"
                      name="flexRadioDefault"
                      id="flexRadioDefault2"
                      value="vertical"
                      checked={layout === 'vertical'}
                      onChange={(e) => handleLayoutChange(e.target.value)}
                    />
                    <label className="form-check-label" htmlFor="flexRadioDefault2">
                      <span className="mdi mdi-arrow-down mdi-24px"></span>
                    </label>
                  </div>
                </div>
              </div>
            </div>
            <div className={`col ${layout !== 'vertical' ? 'd-none' : ''}`}>
              <p>Width</p>
              <div>
                <div className="input-group">
                  <input
                    id="width"
                    type="range"
                    min="400"
                    max="1200"
                    value={width}
                    onChange={(e) => handleWidthChange(e.target.value)}
                    onMouseDownCapture={() => setAllowDrag(false)}
                    onMouseUpCapture={() => setAllowDrag(true)}
                  />
                  <p className="d-block text-center w-100">{width + 'px'}</p>
                </div>
              </div>
            </div>
          </div>

          <div className="row mb-3">
            <div className="col">
              <p>Margins</p>
              <div>
                <div className="input-group">
                  <input
                    id="margins"
                    type="range"
                    min="0"
                    max="250"
                    value={margins}
                    onChange={(e) => handleMarginsChange(e.target.value)}
                    onMouseDownCapture={() => setAllowDrag(false)}
                    onMouseUpCapture={() => setAllowDrag(true)}
                  />
                </div>
              </div>
            </div>
            <div className="col">
              <p className="d-block mt-4 pt-3 w-100">{margins + 'px'}</p>
            </div>
          </div>

          <div className="row mb-3">
            <div className="col">
              <p>Paddings</p>
              <div>
                <div className="input-group">
                  <input
                    id="paddings"
                    type="range"
                    min="0"
                    max="100"
                    value={paddings}
                    onChange={(e) => handlePaddingsChange(e.target.value)}
                    onMouseDownCapture={() => setAllowDrag(false)}
                    onMouseUpCapture={() => setAllowDrag(true)}
                  />
                </div>
              </div>
            </div>
            <div className="col">
              <p className="d-block mt-4 pt-3 w-100">{paddings + 'px'}</p>
            </div>
          </div>

          <div className="mb-5">
            <p>Alignment</p>
            <div className="btn-group w-100" role="group">
              <button
                type="button"
                className={`btn btn-outline-secondary ${alignment === 'flex-start' && 'active'}`}
                onClick={() => handleAlignmentChange('flex-start')}
              >
                <span className="mdi mdi-format-horizontal-align-left"></span>
              </button>
              <button
                type="button"
                className={`btn btn-outline-secondary ${alignment === 'center' && 'active'}`}
                onClick={() => handleAlignmentChange('center')}
              >
                <span className="mdi mdi-format-horizontal-align-center"></span>
              </button>
              <button
                type="button"
                className={`btn btn-outline-secondary ${alignment === 'flex-end' && 'active'}`}
                onClick={() => handleAlignmentChange('flex-end')}
              >
                <span className="mdi mdi-format-horizontal-align-right"></span>
              </button>
            </div>
          </div>

          <div className="mt-5 overflow-hidden">
            <button onClick={() => handleReset()} className="btn btn-outline-primary float-end">
              Reset
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
