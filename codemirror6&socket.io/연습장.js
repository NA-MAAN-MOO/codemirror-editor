/* domEventHandler 사용법 */
// EditorView.domEventHandlers({
//     change(e, view) {
//       if (e.inputType === 'historyUndo') return undo(view);
//       if (e.inputType === 'historyRedo') return redo(view);
//       return false;
//     },
//   });

/* view의 update 메소드를 통해 내용 바꿈 */
// let transaction = state.update({
//   changes: { from: 0, insert: 'ㅋㅋㅋㅋ' },
// });
// console.log(transaction.state.doc.toString()); // "hello editor"
// view.dispatch(transaction);

// const codeChangedPlugin = {
//     update(view, prevState) {
//       const { state, dispatch } = view;
//       if (state.doc !== prevState.doc) {
//         // the document has changed
//         const code = state.toString();
//         socket.emit('CODE_CHANGED', code);
//       }
//     },
//   };
