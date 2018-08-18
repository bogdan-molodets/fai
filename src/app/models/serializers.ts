import { LogResponse, Log } from "./log";
import { Point, MarkerState, MarkerList, Marker } from "./marker";
import { Target, TargetList } from "./target";

export class LogResponseSerializer {
    deserialize(input: any) {
        return new LogResponse(input.log, input.status);
    }
}

export class LogSerializer{
    deserialize(input:any){
        return new Log(input.flight_id,input.message,input.sender,input.timestamp);
    }
}


export class PointSerializer{
    deserialize(input:any){
        return new Point(input.hgt,input.lat,input.lon);
    }
}

export class MarkerStateSerialzer {
    deserialize(input:any) {
        return new MarkerState(input.llh,input.state,input.status);
    }
}

export class MarkerListSerializer {
    deserialize(input:any) {
        return new MarkerList(input.status,input.target)
    }
}

export class MarkerSerializer {
    deserialize(input: any) {
        return new Marker(input.azimuth,input.distance,input.llh,input.marker_id,input.marker_state,input.timestamp);
    }
}


export class TargetSerializer {
    deserialize (input:any) {
        return new Target(input.app_llh,input.ap_marker_id,input.ap_state,input.cp_llh,input.cp_marker_id,input.cp_state,input.rs_id,input.rs_llh,input.rs_state,input.target_id,input.timestamp);
    }
}

export class TargetListSerializer {
    deserialize(input:any) {
        return new TargetList(input.status,input.target);
    }
}