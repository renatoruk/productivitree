// init tree config
productivitree.config = {
    tree: {
        start: {
            seed: 400,
            segments: 6,
            levels: 5,
            vMultiplier: 1.1,
            // changable
            twigScale: 0.05,
            initalBranchLength: 0.3,
            lengthFalloffFactor: 0.8,
            lengthFalloffPower: 0.9,
            clumpMax: 0.45,
            clumpMin: 0.4,
            branchFactor: 1,
            dropAmount: 0.1,
            // changable
            growAmount: 2,
            sweepAmount: 0,
            maxRadius: 0.2,
            // changable
            climbRate: 0.1,
            trunkKink: 0.1,
            treeSteps: 10,
            taperRate: 0.8,
            radiusFalloffRate: 0.75,
            twistRate: 3.02,
            // changable
            trunkLength: 1
        },
        end: {
            seed: 600,
            segments: 6,
            levels: 5,
            vMultiplier: 1.2,
            twigScale: 0.1,
            initalBranchLength: 1,
            lengthFalloffFactor: 0.8,
            lengthFalloffPower: 0.9,
            clumpMax: 0.45,
            clumpMin: 0.4,
            branchFactor: 2.5,
            dropAmount: 0.1,
            growAmount: 0,
            sweepAmount: 0.01,
            maxRadius: 0.2,
            climbRate: 0.5,
            trunkKink: 0.093,
            treeSteps: 10,
            taperRate: 0.9,
            radiusFalloffRate: 0.65,
            twistRate: 3.02,
            trunkLength: 2.4
        }
    }
};