module.exports = class EditorPanel {

    constructor(model) {
        this.type = 'UI';

        this.canvas = document.getElementById('D3');

        this.node = document.createElement('div');
        this.node.className = 'editorPanel';

        this.nodeEntityEditor = document.createElement('div');
        this.nodeEntityEditor.className = 'editor hide';
        this.node.appendChild(this.nodeEntityEditor);

        this.nodeRoadeEditor = document.createElement('div');
        this.nodeRoadeEditor.className = 'editor hide';
        this.node.appendChild(this.nodeRoadeEditor);

        this.nodeEraseEditor = document.createElement('div');
        this.nodeEraseEditor.className = 'editor hide';
        this.node.appendChild(this.nodeEraseEditor);

        const nodeEntityEditorConfirm  = document.createElement('div');
        nodeEntityEditorConfirm.className = 'button confirm';
        nodeEntityEditorConfirm.textContent = 'ok';
        nodeEntityEditorConfirm.onclick = model._onConfirm.bind(model);
        this.nodeEntityEditor.appendChild(nodeEntityEditorConfirm);

        const nodeEntityEditorClose  = document.createElement('div');
        nodeEntityEditorClose.className = 'button cancel';
        nodeEntityEditorClose.textContent = 'cancel';
        nodeEntityEditorClose.onclick = model.close.bind(model);
        this.nodeEntityEditor.appendChild(nodeEntityEditorClose);

        if(model._onRotate) {
            const nodeEntityEditorRotate = document.createElement('div');
            nodeEntityEditorRotate.className = 'button rotate';
            nodeEntityEditorRotate.textContent = 'rotate';
            nodeEntityEditorRotate.onclick = model._onRotate.bind(model);
            this.nodeEntityEditor.appendChild(nodeEntityEditorRotate);
        }

        const nodeRoadeEditorConfirm  = document.createElement('div');
        nodeRoadeEditorConfirm.className = 'button confirm';
        nodeRoadeEditorConfirm.textContent = 'ok';
        nodeRoadeEditorConfirm.onclick = model._onConfirm.bind(model);
        this.nodeRoadeEditor.appendChild(nodeRoadeEditorConfirm);

        const nodeRoadeEditorClose  = document.createElement('div');
        nodeRoadeEditorClose.className = 'button cancel';
        nodeRoadeEditorClose.textContent = 'cancel';
        nodeRoadeEditorClose.onclick = model.close.bind(model);
        this.nodeRoadeEditor.appendChild(nodeRoadeEditorClose);

        const nodeEraseEditorConfirm  = document.createElement('div');
        nodeEraseEditorConfirm.className = 'button confirm';
        nodeEraseEditorConfirm.textContent = 'ok';
        nodeEraseEditorConfirm.onclick = model._onConfirm.bind(model);
        this.nodeEraseEditor.appendChild(nodeEraseEditorConfirm);

        this.updateState(model);

    }

    updateState(model) {


        this.hideNode(this.node);
        this.hideNode(this.nodeEntityEditor);
        this.hideNode(this.nodeRoadeEditor);
        this.hideNode(this.nodeEraseEditor);

        if(model.entityEditor) {
            this.showNode(this.nodeEntityEditor);
        }

        if(model.roadeEditor) {
            this.showNode(this.nodeRoadeEditor);
        }

        if(model.eraseEditor) {
            this.showNode(this.nodeEraseEditor);
        }

        if(model.displayed) {
            this.showNode(this.node);
        }
    }

    showNode(node) {
        const index = node.className.indexOf('hide');
        if(index !== -1) {
            node.className = node.className.replace(' hide', '');
        }
    }

    hideNode(node) {
        if(node.className.indexOf('hide') === -1) {
            node.className += ' hide';
        }
    }

    update(dt) {

    }
};
