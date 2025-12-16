import * as THREE from 'three';

export function createRemotePlayerManager(scene: THREE.Scene) {
    const players = new Map<number, THREE.Mesh>();

    const geometry = new THREE.PlaneGeometry(1, 1);
    const material = new THREE.MeshStandardMaterial({
        color: 0xff00ff, // Magenta for other players
        emissive: 0xff00ff,
        emissiveIntensity: 1.5,
    });

    function updatePlayer(id: number, x: number, y: number) {
        let mesh = players.get(id);

        if (!mesh) {
            mesh = new THREE.Mesh(geometry, material.clone());
            scene.add(mesh);
            players.set(id, mesh);
        }

        // Simple interpolation could go here, but direct set for now
        mesh.position.set(x, y, 0);
    }

    function removePlayer(id: number) {
        const mesh = players.get(id);
        if (mesh) {
            scene.remove(mesh);
            players.delete(id);
        }
    }

    return { updatePlayer, removePlayer };
}
