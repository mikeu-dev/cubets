import * as THREE from 'three';

export function createRemotePlayerManager(scene: THREE.Scene) {
    const players = new Map<number, THREE.Group>();

    const geometry = new THREE.PlaneGeometry(1, 1);
    const material = new THREE.MeshStandardMaterial({
        color: 0xff00ff, // Magenta for other players
        emissive: 0xff00ff,
        emissiveIntensity: 0.8,
    });

    function createPlayerLabel(id: number): THREE.Mesh {
        const canvas = document.createElement('canvas');
        canvas.width = 256;
        canvas.height = 64;
        const context = canvas.getContext('2d');
        if (context) {
            context.fillStyle = 'rgba(0, 0, 0, 0.5)';
            context.fillRect(0, 0, canvas.width, canvas.height);
            context.font = 'bold 36px Arial';
            context.fillStyle = 'white';
            context.textAlign = 'center';
            context.textBaseline = 'middle';
            context.fillText(`Player ${id}`, canvas.width / 2, canvas.height / 2);
        }

        const texture = new THREE.CanvasTexture(canvas);
        const labelGeometry = new THREE.PlaneGeometry(2, 0.5);
        const labelMaterial = new THREE.MeshBasicMaterial({
            map: texture,
            transparent: true
        });
        const labelMesh = new THREE.Mesh(labelGeometry, labelMaterial);
        labelMesh.position.y = 1.0; // Position above the player
        return labelMesh;
    }

    function updatePlayer(id: number, x: number, y: number) {
        let group = players.get(id);

        if (!group) {
            group = new THREE.Group();

            // Player Mesh
            const mesh = new THREE.Mesh(geometry, material.clone());
            group.add(mesh);

            // Label
            const label = createPlayerLabel(id);
            group.add(label);

            scene.add(group);
            players.set(id, group);
        }

        // Update position
        group.position.set(x, y, 0);
    }

    function removePlayer(id: number) {
        const group = players.get(id);
        if (group) {
            scene.remove(group);
            players.delete(id);
        }
    }

    return { updatePlayer, removePlayer };
}
