/**
 * 宿主 DOM 捕获监听。
 *
 * 监听父窗口 body 的新增节点，从中找出可能是悬浮球的元素并交给捕获流程。
 * 之所以用 MutationObserver 而不是定时扫描：悬浮球多是动态挂载的，
 * 观察者能在挂载瞬间响应，避免轮询延迟。
 *
 * 性能注意：新增节点的子节点里，聊天正文区域（#chat 等）变化最频繁，
 * 提前排除可以避免 AI 流式输出时每个 token 都触发一整轮选择器扫描（技术债 B2）。
 */

/** 观察者句柄（模块私有） */
let watcher = null;

export function installHostCaptureWatcher(deps) {
  const t = window.parent.document;
  ((watcher = new MutationObserver((t) => {
    for (const n of t)
      if ("childList" === n.type)
        for (const t of n.addedNodes)
          if (t.nodeType === Node.ELEMENT_NODE) {
            const n = t;
            // 跳过聊天正文区域：AI 流式输出时这里的 DOM 变更极其频繁，而悬浮球从不会渲染
            // 在聊天消息内容里，提前排除可以避免每次打字机刷新都触发一整轮选择器扫描
            if (
              n.closest &&
              n.closest("#chat, .mes_text, .swipe_block, blockquote, pre, code")
            )
              continue;
            (deps.checkAndCaptureNewFloatingBall(n),
              deps.checkAndCaptureFloatingBallByClass(n),
              n.querySelectorAll("[script_id]").forEach((t) => {
                deps.checkAndCaptureNewFloatingBall(t);
              }),
              n.querySelectorAll("[id]").forEach((t) => {
                deps.checkAndCaptureNewFloatingBall(t);
              }));
            const a = [
              ".note-save-selection-ball",
              '[class*="floating"]',
              '[class*="float"]',
              '[class*="ball"]',
              '[class*="fab"]',
              '[class*="draggable"]',
              ".ui-draggable",
              '[style*="position: absolute"]',
              '[style*="position:absolute"]',
            ];
            for (const t of a)
              try {
                n.querySelectorAll(t).forEach((t) => {
                  deps.checkAndCaptureFloatingBallByClass(t);
                });
              } catch {
                /* 选择器不受支持或节点已失效，跳过该模式 */
              }
          }
  })),
    watcher.observe(t.body, { childList: !0, subtree: !0 }));
}

/** 断开监听（主运行时销毁时调用） */
export function disposeHostCaptureWatcher() {
  if (watcher) {
    try {
      watcher.disconnect();
    } catch (e) {
      /* 观察者可能已随页面销毁而失效 */
    }
    watcher = null;
  }
}
