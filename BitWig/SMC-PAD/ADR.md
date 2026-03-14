1. Enforce SoC and SRP across all layers
2. Handlers are stateless and never talk to hardware directly
3. All hardware I/O goes through DeviceCommunicator
4. All mutable state lives in a centralized state/store layer
5. No magic numbers; all mappings are declarative and centralized
6. All events flow through a deterministic dispatcher
7. Hardware synchronization is callback-driven and idempotent
8. The system must fully rehydrate hardware state at any time
9. Hardware failures must not corrupt logical state
10. All input → action → output paths must be traceable via logging